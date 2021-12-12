
import { BACKEND_PORT } from './config.js';
// A helper you may want to use when uploading new images to the server.
import { fileToDataUrl } from './helpers.js';

// log in pop window elements
let popWindow = document.getElementById("popWindow");
let popWindowEmail = document.getElementById("popWindow-email");
let popWindowPassword = document.getElementById("popWindow-password");
let popWindowName = document.getElementById("popWindow-name");
let popWindowConfirmPassword = document.getElementById("popWindow-confirmedpassword");
let loginBtn = document.getElementById("login_btn");
let signupBtn = document.getElementById("signup_btn");
let formSwitchBtn = document.getElementById("form-switch-btn");

// Channel List elements
let channelListPrivate = document.getElementById("channel-private-list");
let templatechannelListChannel = document.getElementById("template-channelList-channel");
let channelCreateBtn = document.getElementById("channel-create-btn");
let channelCreateSubmitBtn = document.getElementById("channel-create-submit-btn");
let chatboxChannelInfo_div = document.getElementById("chatbox-channel-info");
let chatboxChannelInfo_btn_template = document.getElementById("chatbox-channel-info-btn");
let channelListJoinedPublic = document.getElementById("channel-public-joined-list");
let channelListUnjoinedPublic = document.getElementById("channel-public-unjoined-list")
let templateJoinBtn = document.getElementById("template-join-btn");
let channelJoinSubmit = document.getElementById("channel-join-submit");

// Channel info pop window
let channelInfoChannelName = document.getElementById("channel-info-pop-channelName");
let channelInfoChannelCreator = document.getElementById("channel-info-pop-creatorName");
let channelInfoChannelCreateDate = document.getElementById("channel-info-pop-creationDate");
let channelInfoChannelPublicity = document.getElementById("channel-info-pop-channelPublicity");
let channelInfoChannelDescription = document.getElementById("channel-info-pop-channelDescription");

// Main chatbox 
let chatboxDisplayDiv = document.getElementById("chatbox-display");
let chatboxTextInput= document.getElementById("chatbox-textinput");
let chatboxSendBtn = document.getElementById("chatbox-sendBtn");
let chatboxImgInput = document.getElementById("chatbox-imginput");

// Chatbox message template
let chatboxMessageDivTemplate = document.getElementById("template-chatbox-message-div");

// delete message elements
let messageDeleteBtnTemplate = document.getElementById("template-message-delete-btn");
let messageDeletePopBtnDiv= document.getElementById("message-delete-btns");
let messageDeletePopSubmitBtnTemplate = document.getElementById("template-message-delete-submit");

// edit message elements
let messageEditBtnTemplate = document.getElementById("template-message-edit-btn");
let messageEditPopBtnDiv= document.getElementById("message-edit-btns");
let messageEditPopSubmitBtnTemplate = document.getElementById("template-message-edit-submit");

// pin message elements
let messagePinBtn = document.getElementById("chatbox-pined-btn");
let templatePinMsgDiv = document.getElementById("template-pin-message-div");
let pinMsgPopWindowBody = document.getElementById("pinnedMessage-popWindow-body");

// Invite and Leave elements
let channelInviteBtn = document.getElementById("chatbox-info-inviteBtn");
let channelLeaveBtn = document.getElementById("chatbox-info-leaveBtn");
let templateChannelInviteUserCheckbox = document.getElementById("invite-user-checkbox-template");
let channelInviteModalBody = document.getElementById("channelInviteModal-body");
let channelInviteModalSubmitBtn = document.getElementById("channelInviteModal-submit");
let channelLeaveModalSubmitBtn = document.getElementById("channelLeaveModal-submit");

// header elements
let userAccountBtn = document.getElementById("user-account-btn");
let logoutBtn = document.getElementById("logoutBtn");

// Global Variable to store intermediate state information
let user = new Object();
user.token = "";
user.id = 0;
user.currentChannelId = -1;
// user.pinned = 0;
user.password = "";

// Store current channel pinned msgs
// let pinnedMsg = new Object();

// Store Channel members
let channelMembers = [];

// Store current user accountInfo
let accountInfo = new Object();

// default User Profile image
let defaultImg = "../src/default_profile_img.png";

// Counter to track how many message are sent or delete in this channel
// Useful when loading messages.
let messageSentCount = 0;

// id to track which image to display in image modal
let currentImgMsgId = 0;

// object to store all images
let allImage = new Object();

// helper functions to clear a div element
const clearDiv = (divName) => {
    let l = document.getElementById(divName);
    while (l.firstChild) {
        l.removeChild(l.firstChild);
    }
};

// function to convert date into correct format string
const convertISODate = (dateString) => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let date = new Date(dateString);
    const minues = (date.getMinutes() >= 0 && date.getMinutes() <= 9) ? '0'+ date.getMinutes() : date.getMinutes();
    return date.getDate() + " " + monthNames[date.getMonth()] + " " + date.getFullYear() + " " + date.getHours() + ":" + minues;
};

// customised fetch function for all method purpose
const myfetch = (method, path, token, mybody) => {
    const settings = {
        method: method, 
        headers: {
            'Content-type':'application/json',
        },
    };

    if(mybody !== null){
        settings["body"] = JSON.stringify(mybody);
    }
    
    if(token !== null){
        settings.headers['Authorization'] = `Bearer ${token}`;
    }
    return new Promise((resolve, reject) => {
        fetch(`http://localhost:5005/${path}`, settings)
        .then((res) => {
            if(res.ok){
                res.json()
                .then(data => {
                    resolve(data);
                });
            }else{
                res.json()
                .then(e => {
                    reject(e['error']);
                });
            }
        })
        .catch((err) => {
            console.log(err);
        })
    });
};

// function to change Channel Infomation 
// And update the displayed channel list
const changeChannelInfo = (channelId, isPrivate) => {
    let newChannelName = channelInfoChannelName.value === "" ? channelInfoChannelName.placeholder : channelInfoChannelName.value;
    let newChannelDescription = channelInfoChannelDescription.value === "" ? channelInfoChannelDescription.placeholder : channelInfoChannelDescription.value;
    if(newChannelName.length > 25){
        const error = "Please enter a channel name less than 25 characters";
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
        
    }else{
        const body = {
            name: newChannelName,
            description: newChannelDescription,
        };
        myfetch('PUT', `channel/${channelId}`, user.token, body)
        .then((data) => {
            if(isPrivate){
                openList("channel-private", "channel-private-list");
            }else{
                openList("channel-public", "channel-public-list");
            }       
            document.getElementById(`${channelId}`).textContent = channelId + " - " + newChannelName;
        })
        .catch((error) => {
            // alert(error);
            let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                keyboard: false
            })
            document.getElementById("errorModal-body").textContent = error;
            errorModal.show();
        });
    }
};

const getChannelCreator = (channelCreatorId) => {
    return myfetch('GET', `user/${channelCreatorId}`, user.token, null)
    .then((data) => {
        return data.name;
    })
    .catch((error) => {
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};

// function to display the each channel infomation at channel list
const displayChannelInfo = (channelId) => {
    myfetch('GET', `channel/${channelId}`, user.token, null)
    .then((data) => {
        channelInfoChannelName.value = "";
        channelInfoChannelDescription.value = "";
        channelInfoChannelName.placeholder = data.name;
        getChannelCreator(data.creator)
        .then((cName) => {
            channelInfoChannelCreator.textContent = cName;
        });
        // channelInfoChannelCreator.textContent = data.creator;
        channelInfoChannelPublicity.textContent = data.private ? "Private" : "Public";
        channelInfoChannelDescription.placeholder = data.description;
        channelInfoChannelCreateDate.textContent = data.createdAt.substring(0,10);
        
        let channelInfoBtns = document.getElementById("channel-info-pop-btns");
        while(channelInfoBtns.childElementCount > 2){
            channelInfoBtns.removeChild(channelInfoBtns.lastChild);
        }
        let channelInfoSubmitBtn = document.getElementById("channel-info-pop-submit").cloneNode(true);
        channelInfoSubmitBtn.classList.remove("template");
        document.getElementById("channel-info-pop-btns").appendChild(channelInfoSubmitBtn);
        channelInfoSubmitBtn.addEventListener("click", () => {
            changeChannelInfo(channelId, data.private);
        });
    })
    .catch((error) => {
        // alert(error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};

// function to send join channel request
const joinAuth = (channelId) => {
    myfetch('POST', `channel/${channelId}/join`, user.token, null)
    .then((data) => {
        openList("channel-public", "channel-public-list");
    })
    .catch((error) => {
        // alert(error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};

// function to send delete message request
// And update the message div displayed at chatbox
const deleteMessage = (messageId) => {
    myfetch('DELETE', `message/${user.currentChannelId}/${messageId}`, user.token, null)
    .then((data) => {
        const deletedMsgId = `chatbox-message-${messageId}-${user.id}`;
        let deletedMsg = document.getElementById(deletedMsgId);
        deletedMsg.parentElement.removeChild(deletedMsg);
        messageSentCount -= 1;
        // delete pinnedMsg[messageId];
    })
    .catch((error) => {
        // alert(error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};

// helper function to add edit badge to a message
const addEditBadge = (messageId, time) => {
    let editTimeStamp = document.createElement("span");
    editTimeStamp.classList.add("badge");
    editTimeStamp.classList.add("bg-success");
    editTimeStamp.classList.add("rounded-pill");
    editTimeStamp.textContent = "last edited at " + convertISODate(time);
    editTimeStamp.id = `chatbox-message-${messageId}-${user.id}-editbadge`;
    let editDiv = document.getElementById(`chatbox-message-${messageId}-${user.id}-editDiv`);
    editDiv.appendChild(editTimeStamp);
};

// function to be used after editing a message
// Update the message div displayed at chatbox
const modifyMsgDisplay = (messageId, MessageBody, MessageImg, isFirstTimeEdit) => {

    let editedMsgTextBody = document.getElementById(`chatbox-message-${messageId}-${user.id}-textBody`); 
    editedMsgTextBody.textContent = MessageBody;
    
    if(MessageImg !== ""){
        let editedMsgImgBody = document.getElementById(`chatbox-message-${messageId}-${user.id}-imgBody`); 
        if(editedMsgImgBody.childNodes.length !== 0){
            editedMsgImgBody.childNodes[0].src = MessageImg;
        }else{
            let editMsgNewImg = document.createElement("img");
            editMsgNewImg.src = MessageImg;
            editMsgNewImg.alt = "Message Image";
            editMsgNewImg.classList.add("img-thumbnail");
            editMsgNewImg.style.width = "100px";
            editMsgNewImg.style.height = "100px";
            editedMsgImgBody.appendChild(editMsgNewImg);

            editMsgNewImg.addEventListener("click", ()=>{
                let imgModal = new bootstrap.Modal(document.getElementById('msg-image-pop'), {
                    keyboard: false
                })
                document.getElementById("imgModal-img").src = message.image;
                currentImgMsgId = message.id;
                
                fetchAllImages(0)
                .then((data) => {
                    imgModal.show();
                    let keys = Object.keys(allImage).sort();
                    let loc = keys.indexOf(currentImgMsgId.toString());
                    if(loc-1 >= 0){
                        document.getElementById("imgModal-previous").disabled = false;
                    }else{
                        document.getElementById("imgModal-previous").disabled = true;
                    }
    
                    if(loc+1 <= keys.length-1){
                        document.getElementById("imgModal-next").disabled = false;
                    }else{
                        document.getElementById("imgModal-next").disabled = true;
                    }
                })
                .catch((error) => {
                    let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                        keyboard: false
                    })
                    document.getElementById("errorModal-body").textContent = error;
                    errorModal.show();
                });
            });


        }
    }else{
        let editedMsgImgBody = document.getElementById(`chatbox-message-${messageId}-${user.id}-imgBody`);
        if(editedMsgImgBody.childNodes.length !== 0){
            editedMsgImgBody.removeChild(editedMsgImgBody.lastChild);
        }
    }
    const time = Date.now();
    let editDiv = document.getElementById(`chatbox-message-${messageId}-${user.id}-editDiv`);
    if(isFirstTimeEdit && editDiv.childNodes.length === 1){
        addEditBadge(messageId, time);
    }else{
        let editBadge = document.getElementById(`chatbox-message-${messageId}-${user.id}-editbadge`);
        editBadge.textContent = "last edited at " + convertISODate(time);
    }
}

// function to send edit message request
const editMessage = (messageId, newMessageBody, newMessageImg, isFirstTimeEdit) => {
    const body = {
        message: newMessageBody,
        image: newMessageImg,
    };
    myfetch('PUT', `message/${user.currentChannelId}/${messageId}`, user.token, body)
    .then((data) => {
        modifyMsgDisplay(messageId, newMessageBody, newMessageImg,isFirstTimeEdit);
    })
    .catch((error) => {
        // alert("edit msg " + error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};

// helper function to fetch each user information 
// In order to display at chatbox 
const setMessageUser = (msgDivId, msgUserId) => {
    let msgDiv = document.getElementById(msgDivId);
    let messageUserName = msgDiv.childNodes[1].childNodes[1];

    myfetch('GET', `user/${msgUserId}`, user.token, null)
    .then((data) => {
        messageUserName.textContent = data.name;
        let messageUserImg = document.createElement("img");
        messageUserImg.alt = "user profile image";
        if(data.image === null){
            messageUserImg.src = defaultImg;
        }else{
            messageUserImg.src = data.image;
        }
        messageUserImg.width="32"; 
        messageUserImg.height="32" 
        messageUserImg.classList.add("rounded-circle");
        messageUserImg.classList.add("me-2");
        messageUserName.prepend(messageUserImg);
        messageUserName.addEventListener("click", () => {
            let profileModal = new bootstrap.Modal(document.getElementById('userProfile-pop'), {
                keyboard: false
            })
            let profileUserName = document.getElementById("userProfile-name");
            let profileUserEmail = document.getElementById("userProfile-email");
            let profileUserBio = document.getElementById("userProfile-bio");
            let profileUserImg = document.getElementById("userProfile-image");
            profileUserName.textContent = data.name;
            profileUserEmail.textContent = data.email;
            profileUserBio.textContent = data.bio === null ? "" : data.bio;
            if(data.image !== null){
                profileUserImg.src = data.image;
            }else{
                profileUserImg.src = defaultImg;
            }
            profileModal.show();
        });
    })
    .catch((error) => {
        // alert(error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};

// function to react or unreact to a message
// Including display reaction at each message
// And change reaction count
const updateReaction = (messageId, reactionId) =>{
    
    let reactionBtn = document.getElementById(reactionId);
    if(reactionBtn.classList.contains("btn-secondary")){
        reactionBtn.classList.remove("btn-secondary");
        let reactCount = parseInt(reactionBtn.textContent.substring(2));
        reactCount--;
        reactionBtn.textContent = reactionBtn.textContent.substring(0,2) + reactCount;

        const body = {
            react: reactionId.split('-')[6],
        };
        myfetch('POST', `message/unreact/${user.currentChannelId}/${messageId}`, user.token, body)
        .catch((error) => {
            // alert("react msg " + error);
            let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                keyboard: false
            })
            document.getElementById("errorModal-body").textContent = error;
            errorModal.show();
        });

    }else{
        reactionBtn.classList.add("btn-secondary");
        let reactCount = parseInt(reactionBtn.textContent.substring(2));
        reactCount++;
        reactionBtn.textContent = reactionBtn.textContent.substring(0,2) + reactCount;
        const body = {
            react: reactionId.split('-')[6],
        };
        myfetch('POST', `message/react/${user.currentChannelId}/${messageId}`, user.token, body)
        .catch((error) => {
            // alert("react msg " + error);
            let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                keyboard: false
            })
            document.getElementById("errorModal-body").textContent = error;
            errorModal.show();
        });
    }
    
};

// function to pin a Message from chatbox
// Include sending request and changing icon display at each message
const pinMessage = (message, pulledPinIconId, pushedPinIconId) => {

    myfetch('POST', `message/pin/${user.currentChannelId}/${message.id}`, user.token, null)
    .then((data) => {
        document.getElementById(pulledPinIconId).style.display = "none";
        document.getElementById(pushedPinIconId).style.display = "block";
        // user.pinned += 1;
        messagePinBtn.disabled = false;
        // pinnedMsg[message.id] = message;
    })
    .catch((error) => {
        // alert("pin msg " + error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
}

// function to unpin a Message from chatbox
// Include sending request and changing icon display at each message
const unpinMessage = (message, pulledPinIconId, pushedPinIconId) => {

    myfetch('POST', `message/unpin/${user.currentChannelId}/${message.id}`, user.token, null)
    .then((data) => {
        document.getElementById(pulledPinIconId).style.display = "block";
        document.getElementById(pushedPinIconId).style.display = "none";
        // user.pinned -= 1;
        // if(user.pinned === 0){
        //     messagePinBtn.disabled = true;
        // }
        // delete pinnedMsg[message.id];
    })
    .catch((error) => {
        // alert("unpin msg " + error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
}

// helper function to set each message Div's childern element Unique Id
// including ids for reactions and pin icons
const setMessageChildernId = (messageDivId, message) =>{
    let messageDiv = document.getElementById(messageDivId);
    let msgReactionShowup = messageDiv.childNodes[7];
    for(let i = 1; i < msgReactionShowup.childNodes.length; i+=2){
        msgReactionShowup.childNodes[i].id = `${messageDivId}-${msgReactionShowup.childNodes[i].id}`;
        msgReactionShowup.childNodes[i].addEventListener("click", () => {
            updateReaction(message.id, msgReactionShowup.childNodes[i].id);
        });
    }

    let messagPulledPinIcon = messageDiv.childNodes[1].childNodes[5];
    messagPulledPinIcon.id = `${messageDivId}-${messagPulledPinIcon.id}`;
    let messagPushedPinIcon = messageDiv.childNodes[1].childNodes[7];
    messagPushedPinIcon.id = `${messageDivId}-${messagPushedPinIcon.id}`;

    messagPulledPinIcon.addEventListener("click", ()=>{
        pinMessage(message, messagPulledPinIcon.id, messagPushedPinIcon.id);
    });
    messagPushedPinIcon.addEventListener("click", ()=>{
        unpinMessage(message, messagPulledPinIcon.id, messagPushedPinIcon.id);
    });
    
};

// function to initialise the reactions displayed at chatbox
// when first loading the chatbox
const initReaction = (reactions, meesageDivId) => {
    let reactionColletion = {
        "cheers": 0,
        "love": 0,
        "thumbup": 0,
    };
    let amIReact = {
        "cheers": 0,
        "love": 0,
        "thumbup": 0,
    };

    for(let reaction of reactions){
        if(reaction['user'] === user.id){
            amIReact[reaction['react']]++;
        }
        reactionColletion[reaction['react']]++; 
    }

    for(const [key, value] of Object.entries(reactionColletion)){
        let r = document.getElementById(`${meesageDivId}-reaction-badge-${key}`);
        r.classList.remove("template");
        r.textContent = r.textContent+value;
        if(amIReact[key] !== 0){
            r.classList.remove("btn-ouline-secondary");
            r.classList.add("btn-secondary");
        }
    }
};

const fetchAllImages = (startIndex) => {
    return myfetch('GET', `message/${user.currentChannelId}?start=${startIndex}`, user.token, null)
    .then((data) => {
        let messages = data.messages;
        if(messages.length === 0){
            return;
        }else{
            for(const msg of messages){
                if( ("image" in msg) && msg.image !== "" && msg.image !== null){
                    allImage[msg.id] = msg.image;
                }
            }
            return fetchAllImages(startIndex+25);
        }
    });
};
// function to display each single messages at chatbox
const displaySingleMessage = (message, positionToDisplay) => {
    let messageDiv = chatboxMessageDivTemplate.cloneNode(true);
    messageDiv.classList.remove("template");
    if(positionToDisplay === 'append'){
        chatboxDisplayDiv.appendChild(messageDiv);
    }else{
        chatboxDisplayDiv.prepend(messageDiv);
    }
    messageDiv.id = `chatbox-message-${message.id}-${message.sender}`;
    setMessageChildernId(messageDiv.id, message);
    let messageDate= messageDiv.childNodes[1].childNodes[3];
    let messageBody = messageDiv.childNodes[3];
    let messageStatusBtns = messageDiv.childNodes[5];
    messageDate.textContent = convertISODate(message.sentAt);
    
    let msgTextBody = document.createElement("div");
    msgTextBody.id = messageDiv.id + '-textBody';
    msgTextBody.textContent = message.message;

    let msgImgBody = document.createElement("div");
    msgImgBody.id = messageDiv.id + '-imgBody';
    if( ("image" in message) && message.image !== ""){
        let msgImg = document.createElement("img");
        msgImg.src = message.image;
        msgImg.alt = "Message Image";
        msgImg.classList.add("img-thumbnail");
        msgImg.style.width = "100px";
        msgImg.style.height = "100px";
        msgImgBody.appendChild(msgImg);
        msgImg.addEventListener("click", ()=>{
            let imgModal = new bootstrap.Modal(document.getElementById('msg-image-pop'), {
                keyboard: false
            })
            document.getElementById("imgModal-img").src = message.image;
            currentImgMsgId = message.id;
            
            fetchAllImages(0)
            .then((data) => {
                imgModal.show();
                let keys = Object.keys(allImage).sort();
                let loc = keys.indexOf(currentImgMsgId.toString());
                if(loc-1 >= 0){
                    document.getElementById("imgModal-previous").disabled = false;
                }else{
                    document.getElementById("imgModal-previous").disabled = true;
                }

                if(loc+1 <= keys.length-1){
                    document.getElementById("imgModal-next").disabled = false;
                }else{
                    document.getElementById("imgModal-next").disabled = true;
                }
            })
            .catch((error) => {
                let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                    keyboard: false
                })
                document.getElementById("errorModal-body").textContent = error;
                errorModal.show();
            });
        });
    }
    
    // messageBody.textContent = message.message;
    messageBody.appendChild(msgTextBody);
    messageBody.appendChild(msgImgBody);

    if(message.sender === user.id){
        // this is for edit
        let messageEditBtn = messageEditBtnTemplate.cloneNode(true);
        messageEditBtn.classList.remove("template");

        let messageEditDiv = document.createElement("div");
        messageEditDiv.id = `chatbox-message-${message.id}-${message.sender}-editDiv`;
        messageEditDiv.appendChild(messageEditBtn);
        messageStatusBtns.appendChild(messageEditDiv);
        if(message.edited){
            addEditBadge(message.id, message.editedAt);
        }
       
        messageEditBtn.addEventListener("click", () => {
            while(messageEditPopBtnDiv.childElementCount > 1){
                messageEditPopBtnDiv.removeChild(messageEditPopBtnDiv.lastChild);
            }
            let messageEditSubmitBtn = messageEditPopSubmitBtnTemplate.cloneNode(true);
            messageEditSubmitBtn.classList.remove("template");

            let newMessageBody = document.getElementById("msg-edit-new-message");
            let newMessageImg = document.getElementById("msg-edit-new-image");
            newMessageBody.value = "";
            newMessageImg.value = "";

            messageEditPopBtnDiv.appendChild(messageEditSubmitBtn);
            messageEditSubmitBtn.addEventListener("click", ()=>{
                const newMessageBodyValue = newMessageBody.value;
                const newMessageImgValue = newMessageImg.value;

                if(newMessageBodyValue === message.message){
                    // alert("Please write new content");
                    const error = "Please write new content";
                    let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                        keyboard: false
                    })
                    document.getElementById("errorModal-body").textContent = error;
                    errorModal.show();
                }else if (newMessageBodyValue === ""){
                    // alert("You have to edit both message and image");
                    const error = "You have to edit both message and image";
                    let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                        keyboard: false
                    })
                    document.getElementById("errorModal-body").textContent = error;
                    errorModal.show();
                }else{
                    if(newMessageImgValue === ""){
                        editMessage(message.id, newMessageBodyValue, "", !message.edited);
                    }else{
                        const file = newMessageImg.files[0];
                        fileToDataUrl(file)
                        .then((data) => {
                            editMessage(message.id, newMessageBodyValue, data, !message.edited);
                        })
                        .catch((error) => {
                            // alert(error);
                            let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                                keyboard: false
                            })
                            document.getElementById("errorModal-body").textContent = error;
                            errorModal.show();
                        });
                    }
                }
            });
        });

        // this is for delete
        let messageDeleteBtn = messageDeleteBtnTemplate.cloneNode(true);
        messageDeleteBtn.classList.remove("template");
        messageStatusBtns.appendChild(messageDeleteBtn);
        
        messageDeleteBtn.addEventListener("click", () => {
            while(messageDeletePopBtnDiv.childElementCount > 1){
                messageDeletePopBtnDiv.removeChild(messageDeletePopBtnDiv.lastChild);
            }
            let messageDeleteSubmitBtn = messageDeletePopSubmitBtnTemplate.cloneNode(true);
            messageDeleteSubmitBtn.classList.remove("template");
            messageDeletePopBtnDiv.appendChild(messageDeleteSubmitBtn);
            messageDeleteSubmitBtn.addEventListener("click", ()=>{
                deleteMessage(message.id);
            });
        });
        
    }
    setMessageUser(messageDiv.id, message.sender);

    initReaction(message['reacts'], messageDiv.id);

    if(message['pinned']){
        document.getElementById(`${messageDiv.id}-pulledPinIcon`).style.display = 'none';
        document.getElementById(`${messageDiv.id}-pushedPinIcon`).style.display = 'block';
        messagePinBtn.disabled = false;
        // user.pinned += 1;
        // pinnedMsg[message.id] = message;
    }
    
    return messageDiv;
}

// function to fetch messages, everytime only fetching 25 messages
// "Load More" btn to fetch more messages
// "No More Messages" to indicate the end of the messages
const displayMessages = (channelId, startIndex) => {
   
    myfetch('GET', `message/${user.currentChannelId}?start=${startIndex}`, user.token, null)
    .then((data) => {
        let counter = 0;
        for(let message of data.messages){
            counter += 1;
            displaySingleMessage(message, "append");
        }
        let chatboxLoadMoreBtn = document.createElement("button");
        chatboxLoadMoreBtn.classList.add("btn");
        chatboxLoadMoreBtn.classList.add("btn-outline-success");
        if(counter >= 25){
            chatboxLoadMoreBtn.textContent = "Load More";
            chatboxLoadMoreBtn.addEventListener("click", ()=>{
                chatboxDisplayDiv.removeChild(chatboxDisplayDiv.lastChild);
                displayMessages(channelId, startIndex+messageSentCount+25);
                messageSentCount = 0;
            }); 
        }else{
            chatboxLoadMoreBtn.textContent = "No More Messages";
            chatboxLoadMoreBtn.disabled = true;
        }
        chatboxDisplayDiv.appendChild(chatboxLoadMoreBtn);
    })
    .catch((error) => {
        // alert("display messages " +error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};


// function to add each channel button in channel list
// so that user can click them to access or join the channel
const addSingleChannel = (channel, channelList) =>{
    let channelBtn = templatechannelListChannel.cloneNode(true);
    channelBtn.classList.remove("template");
    channelBtn.textContent = channel.id + ": " + channel.name;
    channelList.appendChild(channelBtn);
    channelBtn.addEventListener("click", () => {
        while(chatboxChannelInfo_div.childElementCount > 3){
            chatboxChannelInfo_div.removeChild(chatboxChannelInfo_div.firstChild);
        }
        let chatboxChannelInfo_btn = chatboxChannelInfo_btn_template.cloneNode(true);
        chatboxChannelInfo_btn.classList.remove("template");
        chatboxChannelInfo_btn.disabled = false;
        chatboxChannelInfo_btn.id = channel.id;
        chatboxChannelInfo_btn.textContent = channel.id + " - " + channel.name;
        chatboxChannelInfo_div.prepend(chatboxChannelInfo_btn);
        chatboxChannelInfo_btn.addEventListener("click", () => {
            displayChannelInfo(channel.id);
        });

        // Once entered a channel
        // we to need to enable the buttons at chatbox
        // such as send, invite, leave ...
        
        // we also need to reset some values to keep track of this channel
        // such as pinnedMsg, currentChannelId, channelMembers ...
        clearDiv("chatbox-display");
        chatboxTextInput.disabled = false;
        chatboxTextInput.value = "";
        user.currentChannelId = channel.id;
        // user.pinned = 0;
        messagePinBtn.disabled = false;
        for (let img in allImage){
            delete allImage[img];
        }
        currentImgMsgId = -1;

        chatboxSendBtn.disabled = false;
        chatboxImgInput.disabled = false;
        // messagePinBtn.disabled = true;
        channelInviteBtn.disabled = false;
        channelLeaveBtn.disabled = false;
        channelMembers = [];
        messageSentCount = 0;
        displayMessages(channel.id, 0);
    });
};

// function to display each channel at channel list.
const displayChannelList = (channalArray) => {
    for(let channel of channalArray){
        if(channel.private){
            if(channel.members.includes(user.id)){
                addSingleChannel(channel, channelListPrivate);
            }
        }else{
            if(channel.members.includes(user.id)){
                addSingleChannel(channel, channelListJoinedPublic);
            }else{
                let channelBtn = templateJoinBtn.cloneNode(true);
                channelBtn.classList.remove("template");
                channelBtn.classList.add("list-group-item");
                channelBtn.classList.add("list-group-item-action");
                channelBtn.textContent = channel.id + ": " + channel.name;
                channelListUnjoinedPublic.appendChild(channelBtn);
                channelBtn.addEventListener("click", () => {
                    let joinModalBody = document.getElementById("join-modal-body");
                    joinModalBody.textContent = "Do you want to join Channel - " + channel.id + " - " + channel.name + " ?";
                    channelJoinSubmit.addEventListener("click", ()=>{
                        joinAuth(channel.id);
                    });
                });
            }
        }
    }
};

// function to send create channel request
const createChannel = () => {
    const channelName = document.getElementById("channel-form-name").value;
    const channelPrivacy = document.getElementById("channel-form-privacy").value === "private";
    const channelDescription = document.getElementById("channel-form-description").value;
    if(channelName === ""){
        // alert("Please give channel name");
        const error = "Please give a non-empty channel name";
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    }else if (channelName.length > 25){
        const error = "Please enter a channel name less than 25 characters";
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    }else{        
        const body = {
            name: channelName,
            private: channelPrivacy,
            description: channelDescription,
        };

        myfetch('POST', 'channel', user.token, body)
        .then((data) => {
            if(channelPrivacy){
                openList("channel-private", "channel-private-list");
            }else{
                openList("channel-public", "channel-public-list");
            }
        })
        .catch((error) => {
            let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                keyboard: false
            })
            document.getElementById("errorModal-body").textContent = error;
            errorModal.show();
        });
    }

    
};

// Log in auth
const loginAuth = () => {
    const userEmail = popWindowEmail.value;
    const userPassword = popWindowPassword.value;
    const logInbody = {
        email: userEmail,
        password: userPassword,
    };
    myfetch('POST', 'auth/login', null, logInbody)
    .then((data) => {
        popWindow.style.display = "none";
        user.token = data['token'];
        user.id = data['userId'];
        user.password = userPassword;
        channelCreateBtn.disabled = false;
        userAccountBtn.disabled = false;
    })
    .catch((error) => {
        // alert(error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};

// Register auth
const registerAuth = () => {
    const userEmail = popWindowEmail.value;
    const userName = popWindowName.value;
    const userPassword = popWindowPassword.value;
    const userConfirmPassword = popWindowConfirmPassword.value;

    if(userEmail === "" || userName === "" || userPassword === ""){
        // alert("Please fill the register information");
        const error = "Please fill the register information";
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    }else if(userConfirmPassword != userPassword){
        // alert("two password not matching");
        const error = "two password not matching";
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    }else{
        const registerBody = {
            email: userEmail,
            password: userPassword,
            name: userName,
        }
        myfetch('POST', 'auth/register', null, registerBody)
        .then((data) => {
            popWindow.style.display = "none";
            user.token = data['token'];
            user.id = data['userId'];
            channelCreateBtn.disabled = false;
        })
        .catch((error) => {
            // alert(error);
            let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                keyboard: false
            })
            document.getElementById("errorModal-body").textContent = error;
            errorModal.show();
        });
    }
};

// helper function set styles of different login or register form
const switchForm = () => {
    let name_div = document.getElementById("popWindow-form-name");
    let comfirm_div = document.getElementById("popWindow-form-confirmedpassword");
    if(signupBtn.style.display === "block"){
        name_div.style.display = "none";
        comfirm_div.style.display = "none";
        signupBtn.style.display = "none";
        loginBtn.style.display = "block";
        formSwitchBtn.textContent = "New Here?";
    }else{
        name_div.style.display = "block";
        comfirm_div.style.display = "block";
        signupBtn.style.display = "block";
        loginBtn.style.display = "none";
        formSwitchBtn.textContent = "Already Have an account?";
    }
};

// function to open channel list
// such as Public channel list or Private channel list
function openList(channel, channel_list){
    let l = document.getElementById(channel_list);
    let alink = document.getElementById(channel);

    clearDiv("channel-public-joined-list");
    clearDiv("channel-public-unjoined-list");
    clearDiv("channel-private-list");

    myfetch('GET', 'channel', user.token, null)
    .then((data) => {
        displayChannelList(data.channels);
    })
    .catch((error) => {
        // alert(error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });

    if(l.style.display === 'block'){
        alink.classList.remove("active");
        l.style.display = 'none';
    }else{
        alink.classList.add("active");
        l.style.display = 'block';
    }
}

// function to send messages
const sendMessage = (userText, imgData) => {
    chatboxTextInput.value = "";
    chatboxImgInput.value = "";
    const body = {
        message: userText,
        image: imgData,
    };
    myfetch('POST', `message/${user.currentChannelId}`, user.token, body)
    .then((data) => {
        // clearDiv("chatbox-display");
        // displayMessages(user.currentChannelId, 0);
        myfetch('GET', `message/${user.currentChannelId}?start=0`, user.token, null)
        .then((data) => {
            displaySingleMessage(data.messages[0], "prepend");
            messageSentCount += 1;
        })
        .catch((error) => {
            // alert("display messages " +error);
            let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                keyboard: false
            })
            document.getElementById("errorModal-body").textContent = error;
            errorModal.show();
        });

    })
    .catch((error) => {
        // alert(error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
}

// function to unpin a message from pinned message modal
const unpinMessageFromPopWindow = (message, pinMsgDivId) => {
    const pulledPinIconId = `chatbox-message-${message.id}-${message.sender}-pulledPinIcon`; 
    const pushedPinIconId = `chatbox-message-${message.id}-${message.sender}-pushedPinIcon`; 

    myfetch('POST', `message/unpin/${user.currentChannelId}/${message.id}`, user.token, null)
    .then((data) => {
        document.getElementById(pulledPinIconId).style.display = "block";
        document.getElementById(pushedPinIconId).style.display = "none";
        // user.pinned -= 1;
        // if(user.pinned === 0){
        //     messagePinBtn.disabled = true;
        // }
        // delete pinnedMsg[message.id];
        let pinMsgDiv = document.getElementById(pinMsgDivId);
        pinMsgDiv.parentElement.removeChild(pinMsgDiv);
    })
    .catch((error) => {
        // alert("unpin msg " + error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};

// function to display each pinned message at modal
// which syncs with edited messages
const displaySinglePinnedMsg = (message) => {
    let pinMsgDiv = templatePinMsgDiv.cloneNode(true);
    pinMsgDiv.classList.remove("template");
    pinMsgDiv.id = `pinnedMsg-${message.id}-${message.sender}`;
    pinMsgPopWindowBody.appendChild(pinMsgDiv);
    setMessageUser(pinMsgDiv.id, message.sender);
    let messageDate= pinMsgDiv.childNodes[1].childNodes[3];
    let messageBody = pinMsgDiv.childNodes[3];

    
    // let trueMsgDiv = document.getElementById(`chatbox-message-${message.id}-${message.sender}`);
    // if(trueMsgDiv === null){
    messageDate.textContent = convertISODate(message.sentAt);
    messageBody.textContent = "";
    let msgTextBody = document.createElement("div");
    msgTextBody.id = pinMsgDiv.id + '-textBody';
    msgTextBody.textContent = message.message;

    let msgImgBody = document.createElement("div");
    msgImgBody.id = pinMsgDiv.id + '-imgBody';
    if( ("image" in message) && message.image !== ""){
        let msgImg = document.createElement("img");
        msgImg.src = message.image;
        msgImg.alt = "Message Image";
        msgImg.classList.add("img-thumbnail");
        msgImg.style.width = "100px";
        msgImg.style.height = "100px";
        msgImgBody.appendChild(msgImg);
    }
    
    messageBody.appendChild(msgTextBody);
    messageBody.appendChild(msgImgBody);


    let messagPushedPinIcon = pinMsgDiv.childNodes[1].childNodes[5];
    messagPushedPinIcon.id = `${pinMsgDiv.id}-${messagPushedPinIcon.id}`;

    messagPushedPinIcon.addEventListener("click", ()=>{
        unpinMessageFromPopWindow(message, pinMsgDiv.id);
    });
}


const displayPinnedMessage = (startIndex) =>{

    myfetch('GET', `message/${user.currentChannelId}?start=${startIndex}`, user.token, null)
    .then((data) => {
        let counter = 0;
        for(let message of data.messages){
            counter += 1;
            if(message.pinned){
                // user.pinned += 1;
                // pinnedMsg[message.id] = message;
                displaySinglePinnedMsg(message);
            }
        }
        if(counter >= 25){
            displayPinnedMessage(startIndex+25);
        }
    })
    .catch((error) => {
        // alert("fetch all messages " +error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
};

// function to display each Invite member
const displayInviteList = (allUsers) =>{
    let keys = Object.keys(allUsers);
    keys.sort();
    for(const key of keys){
        let userCheckbox = templateChannelInviteUserCheckbox.cloneNode(true);
        userCheckbox.id = `invite-user-${allUsers[key]}`;
        userCheckbox.classList.remove("template");
        let userCheckboxInput = userCheckbox.childNodes[1];
        userCheckboxInput.id = userCheckbox.id + '-input';
        let userCheckboxLabel = userCheckbox.childNodes[3];
        userCheckboxLabel.id = userCheckbox.id + '-label';
        userCheckboxLabel.setAttribute("for", userCheckboxInput.id);
        userCheckboxInput.value = allUsers[key];
        userCheckboxLabel.textContent = key;
        channelInviteModalBody.appendChild(userCheckbox);
    }
};

// function to send invite request
const inviteUsertoChannel = (userId) =>{
    const body = {
        userId: parseInt(userId),
    };
    myfetch('POST', `channel/${user.currentChannelId}/invite`, user.token, body)
    .catch((error) => {
        // alert(err);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
}

// helper function to toggle visiblity of password
const showPassword = () => {
    let userPassword = document.getElementById("user-account-password-input");
    if (userPassword.type === "password") {
        userPassword.type = "text";
    } else {
        userPassword.type = "password";
    }
};

// helper function to store the old user information
const storeOldAccountInfo = (name, email, bio, password, image) => {
    accountInfo['name'] = name;
    accountInfo['bio'] = bio;
    accountInfo['email'] = email;
    accountInfo['password'] = password;
    accountInfo['image'] = image;
};

// click event for password toggle
document.getElementById("user-account-password-toggle").addEventListener("click",showPassword);

// function to send update user profile request
document.getElementById("user-account-submit").addEventListener("click",() => {
    
    const newAccountName = document.getElementById("user-account-userName").value;
    const newEmail = document.getElementById("user-account-email").value;
    const newBio = document.getElementById("user-account-bio").value;
    const newPassword = document.getElementById("user-account-password-input").value;
    
    let userProfileImgInput = document.getElementById("user-profile-image-input");

    if(userProfileImgInput.value === ""){
        const oldAccountName = accountInfo['name'];
        const oldEmail = accountInfo['email'];
        const oldBio = accountInfo['bio'] === null ? "" : accountInfo['bio'];
        const oldPassword = accountInfo['password'];

        if(newAccountName !== oldAccountName || newEmail !== oldEmail || newBio !== oldBio || newPassword !== oldPassword){
            const body = {};
            if(newAccountName !== oldAccountName){
                body["name"] = newAccountName;
            }
            if(newEmail !== oldEmail){
                body["email"] = newEmail;
            }
            if(newBio !== oldBio){
                body["bio"] = newBio;
            }
            if(newPassword !== oldPassword){
                body["password"] = newPassword;
                user.password = newPassword;
            }
            myfetch('PUT', `user`, user.token, body)
            .then((data) => {})
            .catch((error) => {
                // alert(err);
                let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                    keyboard: false
                })
                document.getElementById("errorModal-body").textContent = error;
                errorModal.show();
            });
        }else{
            // alert("You haven't changed anything");
            const error = "You haven't changed anything";
            let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                keyboard: false
            })
            document.getElementById("errorModal-body").textContent = error;
            errorModal.show();
        }
    }else{

        const file = userProfileImgInput.files[0];
        fileToDataUrl(file)
        .then((data) => {
            
            const oldAccountName = accountInfo['name'];
            const oldEmail = accountInfo['email'];
            const oldBio = accountInfo['bio'] === null ? "" : accountInfo['bio'];
            const oldPassword = accountInfo['password'];
            const oldProfileImg = accountInfo['image'];
            
            if(newAccountName !== oldAccountName || newEmail !== oldEmail || newBio !== oldBio || newPassword !== oldPassword || oldProfileImg !== data){
                const body = {};
                if(newAccountName !== oldAccountName){
                    body["name"] = newAccountName;
                }
                if(newEmail !== oldEmail){
                    body["email"] = newEmail;
                }
                if(newBio !== oldBio){
                    body["bio"] = newBio;
                }
                if(newPassword !== oldPassword){
                    body["password"] = newPassword;
                    user.password = newPassword;
                }
                if(oldProfileImg !== data){
                    body["image"] = data;
                }
                myfetch('PUT', `user`, user.token, body)
                .then((data) => {
                })
                .catch((error) => {
                    // alert(err);
                    let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                        keyboard: false
                    })
                    document.getElementById("errorModal-body").textContent = error;
                    errorModal.show();
                });
            }else{
                // alert("You haven't changed anything");
                const error = "You haven't changed anything";
                let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                    keyboard: false
                })
                document.getElementById("errorModal-body").textContent = error;
                errorModal.show();
                }
        })
        .catch((error) => {
            // alert(error);
            let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                keyboard: false
            })
            document.getElementById("errorModal-body").textContent = error;
            errorModal.show();
        });
    }
});

// function to logout 
// reset global variales and some elements
logoutBtn.addEventListener("click", ()=>{
    myfetch('POST', 'auth/logout', user.token, null)
    .then((data) => {
        popWindow.style.display = "flex";
        
        let pr_alink = document.getElementById("channel-private");
        let pr_l = document.getElementById("channel-private-list");
        if(pr_l.style.display === 'block'){
            pr_alink.classList.remove("active");
            pr_l.style.display = 'none';
        }

        let pu_alink = document.getElementById("channel-public");
        let pu_l = document.getElementById("channel-public-list");
        if(pu_l.style.display === 'block'){
            pu_alink.classList.remove("active");
            pu_l.style.display = 'none';
        }

        clearDiv("chatbox-display");
        chatboxTextInput.disabled = true;
        chatboxSendBtn.disabled = true;
        chatboxImgInput.disabled = true;
        channelInviteBtn.disabled = true;
        channelLeaveBtn.disabled = true;
        messagePinBtn.disabled = true;
        chatboxChannelInfo_div.removeChild(chatboxChannelInfo_div.firstChild);
    })
    .catch((error) => {
        // alert(err);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });

});

// click event to leave the channel
channelLeaveModalSubmitBtn.addEventListener("click", () => {
    
    myfetch('POST', `channel/${user.currentChannelId}/leave`, user.token, null)
    .then((data) => {
        let pr_alink = document.getElementById("channel-private");
        let pr_l = document.getElementById("channel-private-list");
        if(pr_l.style.display === 'block'){
            pr_alink.classList.remove("active");
            pr_l.style.display = 'none';
        }

        let pu_alink = document.getElementById("channel-public");
        let pu_l = document.getElementById("channel-public-list");
        if(pu_l.style.display === 'block'){
            pu_alink.classList.remove("active");
            pu_l.style.display = 'none';
        }

        clearDiv("chatbox-display");
        chatboxTextInput.disabled = true;
        chatboxSendBtn.disabled = true;
        chatboxImgInput.disabled = true;
        channelInviteBtn.disabled = true;
        channelLeaveBtn.disabled = true;
        messagePinBtn.disabled = true;
        chatboxChannelInfo_div.removeChild(chatboxChannelInfo_div.firstChild);
    })
    .catch((error) => {
        // alert(error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
});

// function to display user information at user account pop window
userAccountBtn.addEventListener("click", ()=>{
    myfetch('GET', `user/${user.id}`, user.token, null)
    .then((data) => {
        let userAccountname = document.getElementById("user-account-userName");
        let userEmail = document.getElementById("user-account-email");
        let userBio = document.getElementById("user-account-bio");
        let userPassword = document.getElementById("user-account-password-input");
        let userProfileImg = document.getElementById("user-profile-image");

        userProfileImg.src = data['image'] === null ? defaultImg : data['image'];
        userAccountname.placeholder = data['name'];
        userEmail.placeholder = data['email'];
        userBio.placeholder = data['bio'] === null ? "" : data['bio'];

        userAccountname.value = data['name'];
        userEmail.value = data['email'];
        userBio.value = data['bio'] === null ? "" : data['bio'];

        userPassword.value = user.password;

        storeOldAccountInfo(data['name'], data['email'], data['bio'], user.password), data['image'];

    })
    .catch((error) => {
        // alert(error);
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    });
});

// function to get all checked members for inviting
channelInviteModalSubmitBtn.addEventListener("click", ()=>{
    let userNames = document.querySelectorAll('input[name="userInviteList"]:checked');
    userNames.forEach((username) => {
        inviteUsertoChannel(username.value);
    })
});

// click event to pop the Invite window
channelInviteBtn.addEventListener("click", ()=>{

    let singleUserCheckbox = templateChannelInviteUserCheckbox.cloneNode(true);
    singleUserCheckbox.classList.remove("template");

    const userPromiseList = [];
    userPromiseList.push(myfetch('GET', `channel/${user.currentChannelId}`, user.token, null));

    userPromiseList.push(myfetch('GET', 'user', user.token, null));

    let allUsers = new Object();
    Promise.all(userPromiseList)
    .then((p) =>{
        channelMembers = p[0]['members'];
        let channelInviterListPromises = [];
        for(const u of p[1]['users']){
            if(!channelMembers.includes(u.id)){
                channelInviterListPromises.push(myfetch('GET', `user/${u.id}`, user.token, null)
                .then((data) => {
                    allUsers[data['name']] = u.id;
                }));
            }
        }
        Promise.all(channelInviterListPromises)
        .then((userP) => {
            clearDiv(channelInviteModalBody.id);
            displayInviteList(allUsers);
        });
    });
});

// click event to pop the pinned message window
messagePinBtn.addEventListener("click", ()=>{
    clearDiv("pinnedMessage-popWindow-body");
    displayPinnedMessage(0);
});

loginBtn.addEventListener("click", loginAuth);

formSwitchBtn.addEventListener("click", switchForm);

signupBtn.addEventListener("click", registerAuth);

channelCreateBtn.addEventListener("click", ()=>{
    let channelName = document.getElementById("channel-form-name");
    let channelPrivacy = document.getElementById("channel-form-privacy");
    let channelDescription = document.getElementById("channel-form-description");
    channelName.value = "";
    channelPrivacy.value = "public";
    channelDescription.value = "";
});

channelCreateSubmitBtn.addEventListener("click", createChannel);

document.getElementById("channel-public").addEventListener("click", ()=>openList("channel-public", "channel-public-list"));
document.getElementById("channel-private").addEventListener("click", ()=>openList("channel-private", "channel-private-list"));

// click event to send a message
// including convert attached images
chatboxSendBtn.addEventListener("click", () => {
    let userText = chatboxTextInput.value;
    const checkValidText = userText.replace(/\s/g, "");
    
    if(checkValidText === "" && chatboxImgInput.value === ""){
        // alert("Please enter something...");
        const error = "Please enter something...";
        let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
            keyboard: false
        })
        document.getElementById("errorModal-body").textContent = error;
        errorModal.show();
    }else{
        if(chatboxImgInput.value !== ""){
            const file = chatboxImgInput.files[0];
            fileToDataUrl(file)
            .then((data) => {
                sendMessage(userText, data);
            })
            .catch((error) => {
                // alert(error);
                let errorModal = new bootstrap.Modal(document.getElementById('errorModal'), {
                    keyboard: false
                })
                document.getElementById("errorModal-body").textContent = error;
                errorModal.show();
            });
        }else{
            sendMessage(userText, "");
        }
        
    }
    
});

// click event for image modal previous arrow button
document.getElementById("imgModal-previous").addEventListener("click", ()=>{
    let keys = Object.keys(allImage).sort();
    let loc = keys.indexOf(currentImgMsgId.toString());
    if(loc > 0){
        document.getElementById("imgModal-img").src = allImage[keys[loc-1]];
        currentImgMsgId = parseInt(keys[loc-1]);
        
        // disable previous if it is the first one
        if(loc-2 < 0){
            document.getElementById("imgModal-previous").disabled = true;
        }
        document.getElementById("imgModal-next").disabled = false;
    }

});

// click event for image modal next arrow button
document.getElementById("imgModal-next").addEventListener("click", ()=>{
    let keys = Object.keys(allImage).sort();
    let loc = keys.indexOf(currentImgMsgId.toString());
    if(loc < keys.length-1){
        document.getElementById("imgModal-img").src = allImage[keys[loc+1]];
        currentImgMsgId = parseInt(keys[loc+1]);

        // disable next if it is the last one
        if(loc+2 >= keys.length){
            document.getElementById("imgModal-next").disabled = true;
        }
        document.getElementById("imgModal-previous").disabled = false;
    }
});