function readFile(file, callback) {
    const reader = new FileReader();
    reader.onload = (event) => callback(JSON.parse(event.target.result));
    reader.readAsText(file);
}

function extractUsernames(data) {
    return new Set(data.relationships_following.map(item => item.string_list_data[0].value));
}

function checkUnfollowers() {
    const followingFile = document.getElementById("following").files[0];
    const followersFile = document.getElementById("followers").files[0];

    if (!followingFile || !followersFile) {
        alert("Please upload both files!");
        return;
    }

    readFile(followingFile, (followingData) => {
        readFile(followersFile, (followersData) => {
            const following = extractUsernames(followingData);
            const followers = extractUsernames(followersData);

            const unfollowers = [...following].filter(user => !followers.has(user));
            displayUnfollowers(unfollowers);
        });
    });
}

function displayUnfollowers(unfollowers) {
    const list = document.getElementById("unfollowersList");
    list.innerHTML = "";
    unfollowers.forEach(user => {
        const li = document.createElement("li");
        li.textContent = user;
        list.appendChild(li);
    });
}