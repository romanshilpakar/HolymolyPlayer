// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HolymolyPlayer {
    struct MusicToken {
        uint256 tokenId; 
        address payable owner; 
        address payable author; 
        uint256 price; 
        uint256 likes; 
        string musicName;
        string imageCID;
        string audioCID;
    }

    mapping(uint256 => MusicToken) musicTokens;
    uint256 nextTokenId = 1; 
    mapping(address => uint256[])  likedMusic; 
    mapping(uint256 => uint256)  totalLikes;


    event MusicUploaded(uint256 indexed tokenId, address indexed author, string musicName);
    event MusicLiked(uint256 indexed tokenId, address indexed liker);
    event MusicBought(uint256 indexed tokenId, address indexed buyer, uint256 price);


    function uploadMusic(string memory _musicName,string memory _imageCID,string memory _audioCID, uint256 _price) public {
        require(bytes(_musicName).length > 0, "Music name cannot be empty");

        musicTokens[nextTokenId] = MusicToken(
            nextTokenId,
            payable(msg.sender),
            payable(msg.sender),
            _price,
            0,
            _musicName,
            _imageCID,
            _audioCID
        );

        emit MusicUploaded(nextTokenId, msg.sender, _musicName);
        nextTokenId++;
    }


    function getAllMusic() external view returns (MusicToken[] memory) {
        MusicToken[] memory allMusic = new MusicToken[](nextTokenId - 1);

        for (uint256 i = 1; i < nextTokenId; i++) {
            allMusic[i - 1] = musicTokens[i];
        }
        return allMusic;
    }

    function getMyMusics() external view returns (MusicToken[] memory) {
    uint256 count = 0;
    for (uint256 i = 1; i < nextTokenId; i++) {
        if (musicTokens[i].author == msg.sender) {
            count++;
        }
    }
    MusicToken[] memory myMusics = new MusicToken[](count);
    uint256 index = 0;

    for (uint256 i = 1; i < nextTokenId; i++) {
        if (musicTokens[i].author == msg.sender) {
            myMusics[index] = MusicToken(
                musicTokens[i].tokenId,
                musicTokens[i].owner,
                musicTokens[i].author,
                musicTokens[i].price,
                musicTokens[i].likes,
                musicTokens[i].musicName,
                musicTokens[i].imageCID,
                musicTokens[i].audioCID
            );
            index++;
        }
    }
    return myMusics;
}


    function likeMusic(uint256 tokenId) external {
        MusicToken storage music = musicTokens[tokenId];
        require(music.tokenId != 0, "Music Token does not exist");
    uint256[] storage likedTokenIds = likedMusic[msg.sender];
    for (uint256 i = 0; i < likedTokenIds.length; i++) {
        require(likedTokenIds[i] != tokenId, "Music is already liked");
    }
        music.likes++;
        totalLikes[tokenId]++;

        if (likedMusic[msg.sender].length == 0) {
            likedMusic[msg.sender] = [tokenId];
        } else {
            likedMusic[msg.sender].push(tokenId);
        }

        emit MusicLiked(tokenId, msg.sender);
    }

   function getLikedMusicByUser() external view returns (MusicToken[] memory) {
        uint256[] memory likedTokenIds = likedMusic[msg.sender];
        MusicToken[] memory userLikedMusic = new MusicToken[](likedTokenIds.length);

        for (uint256 i = 0; i < likedTokenIds.length; i++) {
            MusicToken storage music = musicTokens[likedTokenIds[i]];
            userLikedMusic[i] = MusicToken(
                music.tokenId,
                music.owner,
                music.author,
                music.price,
                music.likes,
                music.musicName,
                music.imageCID,
                music.audioCID
            );
        }
        return userLikedMusic;
    }


    function getTotalLikes(uint256 tokenId) external view returns (uint256) {
        return totalLikes[tokenId];
    }


function buyMusic(uint256 tokenId) external payable {
    MusicToken storage music = musicTokens[tokenId];
    require(music.tokenId != 0, "Music Token does not exist");
    require(music.owner != msg.sender, "You cannot buy your own music");
    require(music.author != msg.sender, "You cannot buy your own music");
    require(msg.value >= music.price, "Insufficient funds to buy");

    address payable previousOwner = music.owner;
    previousOwner.transfer(music.price);
    music.owner = payable(msg.sender);

    emit MusicBought(tokenId, msg.sender, music.price);
}



    function unlikeMusic(uint256 tokenId) external {
        MusicToken storage music = musicTokens[tokenId];
        require(music.tokenId != 0, "Music Token does not exist");

        // Check if the caller has liked this music
        uint256[] storage likedTokenIds = likedMusic[msg.sender];
        bool isLiked = false;
        uint256 indexToRemove;
        for (uint256 i = 0; i < likedTokenIds.length; i++) {
            if (likedTokenIds[i] == tokenId) {
                isLiked = true;
                indexToRemove = i;
                break;
            }
        }
        require(isLiked, "Music is not liked");
        music.likes--;
        totalLikes[tokenId]--;

        if (indexToRemove != likedTokenIds.length - 1) {
            likedTokenIds[indexToRemove] = likedTokenIds[likedTokenIds.length - 1];
        }
        likedTokenIds.pop();

        emit MusicLiked(tokenId, msg.sender);
    }


    function getMyBoughtMusics() external view returns (MusicToken[] memory) {
    uint256 count = 0;

    for (uint256 i = 1; i < nextTokenId; i++) {
        if (musicTokens[i].owner == msg.sender && musicTokens[i].author != msg.sender) {
            count++;
        }
    }

    MusicToken[] memory myBoughtMusics = new MusicToken[](count);
    uint256 index = 0;

    for (uint256 i = 1; i < nextTokenId; i++) {
        if (musicTokens[i].owner == msg.sender && musicTokens[i].author != msg.sender) {
            myBoughtMusics[index] = MusicToken(
                musicTokens[i].tokenId,
                musicTokens[i].owner,
                musicTokens[i].author,
                musicTokens[i].price,
                musicTokens[i].likes,
                musicTokens[i].musicName,
                musicTokens[i].imageCID,
                musicTokens[i].audioCID
            );
            index++;
        }
    }

    return myBoughtMusics;
}

}
