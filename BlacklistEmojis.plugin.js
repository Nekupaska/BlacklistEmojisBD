/**
 * @name BlacklistEmojis
 * @author Nekupaska
 * @description Hides stupid emotes. Ctrl+Shift+X+LeftClick on the emote you want to hide. To unhide, good luck lmao (open the console with Ctrl+Shift+I, select the emote you want to delist and look for data-id's value. Then open C:\Users\*yourname*\AppData\Roaming\BetterDiscord\plugins\BlacklistEmojis.config.json and  look for that ID and remove the line).
 * @version 0.0.2
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

window.onmousedown= function(e){
	click=true;	
	//console.log("down");
}
window.onmouseup= function(e){
	click=false;	
	//console.log("up");
}


var blacklistedEmotes = global.BdApi.loadData("BlacklistEmojis", "disabledEmojis") ?? null; //load list of emote ids

///Upon HTML changing, checks for all emojis, adds onClickEvents for hiding, and hides them accordingly, if any are supposed to be hidden
function hideEmotes(changes) {
    let emotes = document.querySelectorAll("img[data-type='emoji']"); //use changes from observer(changes) instead, search there
    if (emotes != null && emotes.length > 0) {
        let emote = null;
        for (let i = 0; i < emotes.length; i++) {
			
			//add event if not present
			if (emotes[i].getAttribute('listener') !== 'true') {
				emotes[i].onclick = clickEmoteToBlacklist(emotes[i]);
				emotes[i].setAttribute('listener', 'true');
			}
			
			//hide emote if in json list of ids
            emote = emotes[i].getAttribute("data-id");
            if (emote != undefined && blacklistedEmotes.includes(emote)) {
				emotes[i].style.opacity=0; //hide emote

            }
        }
    }

}

///If combination of keys pressed at the moment of execution
function clickEmoteToBlacklist(em) {
    if (pressedKeys["16"] && pressedKeys["17"] && pressedKeys["88"]) {
		//if emoji
        if (em.getAttribute("data-type") == "emoji") {
            blacklistEmote(em.getAttribute("data-id")); //blacklist emote
			em.style.opacity=0; //hide emote
			
        }
    }
}

///Add to blacklist if not already there
function blacklistEmote(id) {
    let newId = id;
    if (!blacklistedEmotes.includes(newId)) {
        blacklistedEmotes.push(newId);
        global.BdApi.saveData("BlacklistEmojis", "disabledEmojis", blacklistedEmotes);
    }
}

///BdApi module setup
module.exports = class blacklistEmojis {
    hideEmotess(changes) {
        hideEmotes(changes);
    }

    load() {}
    start() {}
    stop() {}
    observer(changes) {
        this.hideEmotess(changes); //on HTML change
    }
}
