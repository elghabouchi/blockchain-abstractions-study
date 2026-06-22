// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/Counters.sol";
import "./TokenTours.sol";

contract ReservationTours {
    using Counters for Counters.Counter;
    Counters.Counter private _tourIdCounter;

    TokenTours public tokenTour;
    address public owner;

    struct Tour {
        uint256 id;
        string name;
        string location;
        uint256 price;
        uint256 availableSeats;
        string description;
        uint256 timestamp;
        string image;
        string duration;
        address payable creator;
    }

    mapping(uint256 => Tour) public tours;
    mapping(address => uint256[]) public userReservations;

    event TourAdded(
        uint256 indexed tourId,
        string name,
        string location,
        uint256 price,
        string description,
        address indexed creator
    );

    event TourReserved(
        address indexed user,
        uint256 indexed tourId,
        uint256 price,
        uint256 timestamp,
        address indexed creator
    );

    constructor(address tokenTourAddress) {
        tokenTour = TokenTours(tokenTourAddress);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    function ajouterTour(
        string memory name,
        string memory location,
        uint256 price,
        uint256 availableSeats,
        string memory description,
        string memory image,
        string memory duration
    ) external {
        require(price > 0, "The price must be greater than 0");
        require(availableSeats > 0, "The number of available seats must be greater than 0");

        _tourIdCounter.increment();
        uint256 newTourId = _tourIdCounter.current();

        tours[newTourId] = Tour(
            newTourId,
            name,
            location,
            price,
            availableSeats,
            description,
            block.timestamp,
            image,
            duration,
            payable(msg.sender)
        );

        emit TourAdded(newTourId, name, location, price, description, msg.sender);
    }

    function reserverTour(uint256 tourId) external payable {
        Tour storage tour = tours[tourId];
        require(tour.id != 0, "The tour does not exist");
        require(tour.availableSeats > 0, "No seats available");
        require(msg.value == tour.price, "Incorrect payment amount");

        tour.availableSeats--;
        userReservations[msg.sender].push(tourId);

        // Send payment directly to the tour creator
        (bool sent, ) = tour.creator.call{value: msg.value}("");
        require(sent, "Payment to the creator failed");

        // Award the TokenTours reward
        uint256 rewardAmount = (msg.value * 10) / 1 ether;
        tokenTour.mintTokens(msg.sender, rewardAmount * 1e18);

        emit TourReserved(msg.sender, tourId, msg.value, block.timestamp, tour.creator);
    }

    function obtenirTour(uint256 tourId) external view returns (Tour memory) {
        require(tours[tourId].id != 0, "The tour does not exist");
        return tours[tourId];
    }

    function obtenirReservationsUtilisateur(address user) external view returns (uint256[] memory) {
        return userReservations[user];
    }

    function obtenirTousLesTours() external view returns (Tour[] memory) {
        uint256 totalTours = _tourIdCounter.current();
        Tour[] memory allTours = new Tour[](totalTours);

        for (uint256 i = 1; i <= totalTours; i++) {
            allTours[i - 1] = tours[i];
        }

        return allTours;
    }

    function retirerFonds() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Transfer failed");
    }

    function transfererPropriete(address newOwner) external onlyOwner {
        require(newOwner != address(0), "The new owner is the zero address");
        owner = newOwner;
    }
}
