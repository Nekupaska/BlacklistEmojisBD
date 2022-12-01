/**
 * @name BlacklistEmojis
 * @author Nekupaska
 * @description Hides stupid emotes. Ctrl+Shift+X+LeftClick on the emote you want to hide. To unhide, good luck lmao (open the console with Ctrl+Shift+I, select the emote you want to delist and look for data-id's value. Then open C:\Users\*yourname*\AppData\Roaming\BetterDiscord\plugins\BlacklistEmojis.config.json and  look for that ID and remove the line).
 * @version 0.0.1
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


var blacklistedEmotes = global.BdApi.loadData("BlacklistEmojis", "disabledEmojis") ?? null;

function hideEmotes(changes) {
    let emotes = document.querySelectorAll("img[data-type='emoji']"); ///use changes from observer(changes) instead, search there
    if (emotes != null && emotes.length > 0) {
        let emote = null;
        for (let i = 0; i < emotes.length; i++) {
			
			//add event if not present
			if (emotes[i].getAttribute('listener') !== 'true') {
				emotes[i].onclick = clickEmoteToBlacklist(emotes[i]);
				emotes[i].setAttribute('listener', 'true');
			}
			
            emote = emotes[i].getAttribute("data-id");
            if (emote != undefined && blacklistedEmotes.includes(emote)) {
				if(emotes[i].getAttribute("alt")==null){
					emotes[i].setAttribute("alt",emotes[i].getAttribute("aria-label"));
				}
				emotes[i].style.opacity=0; 

            }
        }
    }

}


function clickEmoteToBlacklist(em) {
		console.log(em);
    if (pressedKeys["16"] && pressedKeys["17"] && pressedKeys["88"]) {
        if (em.getAttribute("data-type") == "emoji") {
            blacklistEmote(em.getAttribute("data-id"));
			if(em.getAttribute("alt")==null){
				em.setAttribute("alt",em.getAttribute("aria-label"));
			}
			em.style.opacity=0; 
			
        }
    }
}

//Add to blacklist if not already there
function blacklistEmote(id) {
    let newId = id;
    if (!blacklistedEmotes.includes(newId)) {
        blacklistedEmotes.push(newId);
        global.BdApi.saveData("BlacklistEmojis", "disabledEmojis", blacklistedEmotes);
    }
}

module.exports = class blacklistEmojis {
    hideEmotess(changes) {
        hideEmotes(changes);
    }

    load() {}
    start() {}
    stop() {}
    observer(changes) {
        this.hideEmotess(changes);
    }
}
