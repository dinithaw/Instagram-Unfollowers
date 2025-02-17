// function readFile(file, callback) {
//     const reader = new FileReader();
//     reader.onload = (event) => callback(JSON.parse(event.target.result));
//     reader.readAsText(file);
// }

// function extractUsernames(data) {
//     return new Set(data.relationships_following.map(item => item.string_list_data[0].value));
// }

// function checkUnfollowers() {
//     const followingFile = document.getElementById("following").files[0];
//     const followersFile = document.getElementById("followers").files[0];

//     if (!followingFile || !followersFile) {
//         alert("Please upload both files!");
//         return;
//     }

//     readFile(followingFile, (followingData) => {
//         readFile(followersFile, (followersData) => {
//             const following = extractUsernames(followingData);
//             const followers = extractUsernames(followersData);

//             const unfollowers = [...following].filter(user => !followers.has(user));
//             displayUnfollowers(unfollowers);
//         });
//     });
// }

// function displayUnfollowers(unfollowers) {
//     const list = document.getElementById("unfollowersList");
//     list.innerHTML = "";
//     unfollowers.forEach(user => {
//         const li = document.createElement("li");
//         li.textContent = user;
//         list.appendChild(li);
//     });
// }

document.getElementById('checkButton').addEventListener('click', function() {
    const followingFile = document.getElementById('followingFile').files[0];
    const followersFile = document.getElementById('followersFile').files[0];

    if (followingFile && followersFile) {
        const followingReader = new FileReader();
        const followersReader = new FileReader();

        followingReader.onload = function(event) {
            const followingList = JSON.parse(event.target.result).relationships_following;
            followersReader.onload = function(event) {
                const followersList = JSON.parse(event.target.result);
                const unfollowers = findUnfollowers(followingList, followersList);
                displayUnfollowers(unfollowers);
            };
            followersReader.readAsText(followersFile);
        };
        followingReader.readAsText(followingFile);
    } else {
        alert('Please upload both files.');
    }
});

function findUnfollowers(followingList, followersList) {
    const followingSet = new Set(followingList.map(user => user.string_list_data[0]?.value));
    const followersSet = new Set(followersList.map(user => user.string_list_data[0]?.value));
    return [...followingSet].filter(username => username && !followersSet.has(username));
}

function displayUnfollowers(unfollowers) {
    const resultContainer = document.getElementById('result');
    resultContainer.innerHTML = '';
    if (unfollowers.length === 0) {
        resultContainer.innerHTML = '<p>All users follow you back!</p>';
    } else {
        const ul = document.createElement('ul');
        unfollowers.forEach(username => {
            const li = document.createElement('li');
            li.textContent = username;
            ul.appendChild(li);
        });
        resultContainer.appendChild(ul);
    }
}