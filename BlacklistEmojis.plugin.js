/**
 * @name BlacklistEmojis
 * @author Nekupaska
 * @description Hides stupid emotes. 
 Ctrl+Shift+X+LeftClick on the emote you want to hide.
 Ctrl+Shift+Z+LeftClick to unhide. 
 For reactions, hovering over them while having the proper shortcut pressed will do the same. Idk why tho.
 To unhide manually, good luck lmao (open the console with Ctrl+Shift+I, select the emote you want to delist and look for data-id's value. Then open C:\Users\*yourname*\AppData\Roaming\BetterDiscord\plugins\BlacklistEmojis.config.json and  look for that ID and remove the line).
 * @version 0.0.3
 * @authorLink https://twitter.com/nekubaba
 */
var pressedKeys = {};
var click = false;
window.onkeyup = function(e) {
    pressedKeys[e.keyCode] = false;
    //console.log(pressedKeys);
}
window.onkeydown = function(e) {
    pressedKeys[e.keyCode] = true;
    //console.log(pressedKeys);
}

window.onmousedown = function(e) {
    click = true;
    //console.log("down");
}
window.onmouseup = function(e) {
    click = false;
    //console.log("up");
}

var blacklistedEmotes = global.BdApi.loadData("BlacklistEmojis", "disabledEmojis") ?? null; //load list of emote ids

///Upon HTML changing, checks for all emojis, adds onClickEvents for hiding, and hides them accordingly, if any are supposed to be hidden. If not, shows emotes previously blacklisted in this session
function processEmotes(changes) {
    let emotes = document.querySelectorAll("img[data-type='emoji']"); //use changes from observer(changes) instead, search there
    if (emotes != null && emotes.length > 0) {
        let emote = null;
        for (let i = 0; i < emotes.length; i++) {

            //add hide event if not present
            if (emotes[i].getAttribute('listenerHide') !== 'true') {
                emotes[i].onclick = clickEmoteToBlacklist(emotes[i]);
                emotes[i].setAttribute('listenerHide', 'true');
            }

            ///////////

            //add show event if not present
            if (emotes[i].getAttribute('listenerShow') !== 'true') {
                emotes[i].onclick = clickEmoteToRemoveFromBlacklist(emotes[i]);
                emotes[i].setAttribute('listenerShow', 'true');
            }

            //////////
            //Process from internal list
            emote = emotes[i].getAttribute("data-id");
            if (emote != undefined) {
                if (blacklistedEmotes.includes(emote)) {
                    hideElement(emotes[i]);
                } else {
                    showElement(emotes[i]);
                }
            }

        }
    }

    blacklistedEmotes = global.BdApi.loadData("BlacklistEmojis", "disabledEmojis") ?? null; //refresh list

}

///If combination of keys pressed at the moment of execution Ctrl+Shift+X+LeftClick
function clickEmoteToBlacklist(em) {
    if (pressedKeys["16"] && pressedKeys["17"] && pressedKeys["88"]) {
        //if emoji
        if (em.getAttribute("data-type") == "emoji") {
            blacklistEmote(em.getAttribute("data-id"), em); //blacklist emote

        }
    }
}

///If combination of keys pressed at the moment of execution Ctrl+Shift+Z+LeftClick
function clickEmoteToRemoveFromBlacklist(em) {
    if (pressedKeys["16"] && pressedKeys["17"] && pressedKeys["90"]) {
        //if emoji
        if (em.getAttribute("data-type") == "emoji") {
            removeEmoteFromblacklist(em.getAttribute("data-id"), em); //unlist emote

        }
    }
}

///Add to blacklist if not already there
function blacklistEmote(id, em) {
    let newId = id;
    if (!blacklistedEmotes.includes(newId)) {
        blacklistedEmotes.push(newId);
        global.BdApi.saveData("BlacklistEmojis", "disabledEmojis", blacklistedEmotes);
        hideElement(em);
        global.BdApi.showToast("Emote hidden");
    }
}

///Remove from blacklist if it's in it
function removeEmoteFromblacklist(id, em) {
    let newId = id;
    if (blacklistedEmotes.includes(newId)) {
        //remove from blacklist
        var editedList = blacklistedEmotes.filter(function(value, index, arr) {
            return value != newId;
        });

        global.BdApi.saveData("BlacklistEmojis", "disabledEmojis", editedList);
        showElement(em);
        global.BdApi.showToast("Emote unhidden");
    }
}

function hideElement(em) {
    em.style.opacity = 0; //hide emote
}

function showElement(em) {
    em.style.opacity = 1; //show emote
}

///BdApi module setup
module.exports = class blacklistEmojis {
    processEmotess(changes) {
        processEmotes(changes);
    }

    load() {}
    start() {}
    stop() {}
    observer(changes) {
        this.processEmotess(changes); //on HTML change
    }
}