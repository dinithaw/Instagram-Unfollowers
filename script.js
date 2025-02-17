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