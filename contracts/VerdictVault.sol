// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VerdictVault {

    enum Status {
        ACTIVE,
        VERIFIED,
        REVOKED
    }

    struct Verdict {
        string caseID;
        string ipfsHash;
        string documentHash;
        string title;
        string category;
        uint256 timestamp;
        address uploader;
        Status status;
        bool exists;
    }

    struct AccessLog {
        address user;
        uint256 timestamp;
        string action;
    }

    mapping(string => Verdict) private verdicts;
    mapping(string => AccessLog[]) private accessLogs;

    event VerdictStored(
        string indexed caseID,
        string ipfsHash,
        string documentHash,
        address indexed uploader
    );

    event VerdictVerified(
        string indexed caseID,
        address indexed verifier,
        uint256 timestamp
    );

    event VerdictRevoked(
        string indexed caseID,
        address indexed revoker,
        uint256 timestamp
    );

    event AccessRecorded(
        string indexed caseID,
        address indexed user,
        string action,
        uint256 timestamp
    );

    function storeVerdict(
        string memory _caseID,
        string memory _ipfsHash,
        string memory _documentHash,
        string memory _title,
        string memory _category
    ) public {

        require(
            !verdicts[_caseID].exists,
            "Case already exists"
        );

        verdicts[_caseID] = Verdict({
            caseID: _caseID,
            ipfsHash: _ipfsHash,
            documentHash: _documentHash,
            title: _title,
            category: _category,
            timestamp: block.timestamp,
            uploader: msg.sender,
            status: Status.ACTIVE,
            exists: true
        });

        accessLogs[_caseID].push(
            AccessLog(
                msg.sender,
                block.timestamp,
                "UPLOAD"
            )
        );

        emit VerdictStored(
            _caseID,
            _ipfsHash,
            _documentHash,
            msg.sender
        );

        emit AccessRecorded(
            _caseID,
            msg.sender,
            "UPLOAD",
            block.timestamp
        );
    }

    function verifyVerdict(
        string memory _caseID,
        string memory _documentHash
    ) public returns (bool) {

        require(
            verdicts[_caseID].exists,
            "Case not found"
        );

        bool verified =
            keccak256(
                abi.encodePacked(
                    verdicts[_caseID].documentHash
                )
            ) ==
            keccak256(
                abi.encodePacked(_documentHash)
            );

        if (verified) {

            verdicts[_caseID].status =
                Status.VERIFIED;

            accessLogs[_caseID].push(
                AccessLog(
                    msg.sender,
                    block.timestamp,
                    "VERIFIED"
                )
            );

            emit VerdictVerified(
                _caseID,
                msg.sender,
                block.timestamp
            );

            emit AccessRecorded(
                _caseID,
                msg.sender,
                "VERIFIED",
                block.timestamp
            );
        }

        return verified;
    }

    function revokeVerdict(
        string memory _caseID
    ) public {

        require(
            verdicts[_caseID].exists,
            "Case not found"
        );

        verdicts[_caseID].status =
            Status.REVOKED;

        accessLogs[_caseID].push(
            AccessLog(
                msg.sender,
                block.timestamp,
                "REVOKED"
            )
        );

        emit VerdictRevoked(
            _caseID,
            msg.sender,
            block.timestamp
        );

        emit AccessRecorded(
            _caseID,
            msg.sender,
            "REVOKED",
            block.timestamp
        );
    }

    function getVerdict(
        string memory _caseID
    )
        public
        view
        returns (
            string memory caseID,
            string memory ipfsHash,
            string memory documentHash,
            string memory title,
            string memory category,
            uint256 timestamp,
            address uploader,
            Status status
        )
    {
        require(
            verdicts[_caseID].exists,
            "Case not found"
        );

        Verdict memory v =
            verdicts[_caseID];

        return (
            v.caseID,
            v.ipfsHash,
            v.documentHash,
            v.title,
            v.category,
            v.timestamp,
            v.uploader,
            v.status
        );
    }

    function getAccessLogs(
        string memory _caseID
    )
        public
        view
        returns (AccessLog[] memory)
    {
        require(
            verdicts[_caseID].exists,
            "Case not found"
        );

        return accessLogs[_caseID];
    }
}