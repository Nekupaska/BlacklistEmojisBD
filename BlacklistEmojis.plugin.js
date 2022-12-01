/**
 * @name BlacklistEmojis
 * @author Nekupaska
 * @description Hides stupid emotes. Ctrl+Shift+X+LeftClick on the emote you want to hide. To unhide, good luck lmao (open the console with Ctrl+Shift+I, select the emote you want to delist and look for data-id's value. Then open C:\Users\*yourname*\AppData\Roaming\BetterDiscord\plugins\BlacklistEmojis.config.json and  look for that ID and remove the line).
 * @version 0.0.1
 * @authorLink https://twitter.com/nekubaba
 */

/*let observer = new MutationObserver(callback);
    
function callback (mutations) {
  hideEmotes();
}

observer.observe(document.querySelectorAll("div[class^='chat-']")[0], null);*/
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

//new&faster(?), but doesn't hide when emotes[i].style.display = "none";
/*function hideEmotes(changes) {
    let emotes = [];

    //iterate through changes and only get the emote elements added
    for (let node of changes.addedNodes) {
        if (!(node instanceof HTMLElement)) continue;

        for (let elem of node.querySelectorAll("img[data-type='emoji']")) {
			let emoteId=null;
            emotes.push(elem);
			emoteId = elem.getAttribute("data-id");
			
			if (emoteId != null && blacklistedEmotes.includes(emoteId)) {
                elem.style.display = "none";
				console.log(elem);
                
            }
			if (elem.getAttribute('listener') !== 'true') {
				elem.onclick = clickEmoteToBlacklist(elem);
				elem.setAttribute('listener', 'true');
			}
        }
    }

}
*/
//old
function hideEmotes(changes) {
    let emotes = document.querySelectorAll("img[data-type='emoji']"); ///use changes from observer(changes) instead, search there
    if (emotes != null && emotes.length > 0) {
        let emote = null;
        for (let i = 0; i < emotes.length; i++) {
			
			//add event if not present
			if (emotes[i].getAttribute('listener') !== 'true') {
				//emotes[i].onclick = clickEmoteToBlacklist(emotes[i]);
				emotes[i].onclick = clickEmoteToBlacklist(emotes[i]);
				emotes[i].setAttribute('listener', 'true');
			}
			
            emote = emotes[i].getAttribute("data-id");
            if (emote != undefined && blacklistedEmotes.includes(emote)) {
				if(emotes[i].getAttribute("alt")==null){
					//emotes[i].style.display = "none";
					//emotes[i].parentElement.innerHTML = emotes[i].getAttribute("aria-label");
					emotes[i].setAttribute("alt",emotes[i].getAttribute("aria-label"));
				}
				//emotes[i].setAttribute("src","");
				//emotes[i].parentElement.style.visibility="hidden"; 
				emotes[i].style.opacity=0; 

            }
        }
    }

}

//Check element clicked
/*document.onclick = function checkElement(e) {
    let evtobj = window.event ? event : e;
    //requires ctrl+shift+click on the emote
    if (evtobj.ctrlKey && evtobj.shiftKey) {
        if (e.target.getAttribute("data-type") == "emoji") {
			blacklistEmote(e.target.getAttribute("data-id"));
			e.target.style.display = "none";
		}
        
    }
}*/

function clickEmoteToBlacklist(em) {
    //let evtobj = window.event;
    //if (evtobj.ctrlKey && evtobj.shiftKey) {
		console.log(em);
    if (pressedKeys["16"] && pressedKeys["17"] && pressedKeys["88"] /*&& click*/) {
        //console.log("Blacklist: it works lol");
        if (em.getAttribute("data-type") == "emoji") {
            blacklistEmote(em.getAttribute("data-id"));
			if(em.getAttribute("alt")==null){
				//em.style.display = "none";
				//em.innerHTML = em.getAttribute("aria-label");
				//em.parentElement.innerHTML = em.getAttribute("aria-label");
				em.setAttribute("alt",em.getAttribute("aria-label"));
			}
			//em.setAttribute("src","");
			//em.parentElement.style.visibility="hidden"; 
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