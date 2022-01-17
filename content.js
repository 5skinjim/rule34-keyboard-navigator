
let scale = 0.75
let yshift = 0.0

let selectedLinkIndex = 0
let selectedLink

let media
let onloadEvent
let iframe

let pop = document.createElement("div")

pop.style.zIndex = '100000'
pop.style.width = "100vw"
pop.style.height = "100vh"
pop.style.pointerEvents = "none"

pop.style.position = 'fixed'
pop.style.top = '0'
pop.style.left = '0'

pop.style.display = 'flex'
pop.style.justifyContent = 'center'
pop.style.alignItems = 'center'
pop.style.flexDirection = 'column'

document.body.appendChild(pop)

let mediaLinks = Array.from(document.querySelectorAll('.image-list > .thumb > a'))

selectLink(mediaLinks[selectedLinkIndex])

for (const link of mediaLinks) {
    link.href = 'javascript:void(0)'
    link.addEventListener('click', (e) => {
        selectLink(link)
        openSelectedMedia(link.id.substring(1))
    })
}

function selectLink(link) {
    if (!!selectedLink){
        selectedLink.querySelector('img').style.boxShadow = 'none'
    }
    selectedLink = link
    if (mediaLinks[selectedLinkIndex] !== selectedLink) {
        selectedLinkIndex = mediaLinks.indexOf(selectedLink)
    }
    selectedLink.querySelector('img').style.boxShadow = '8px 5px 15px #000a';
    
}

function closeMedia() {
    pop.style.backgroundColor = '#0000'
    if (!!media) {
        media.parentNode.innerHTML = ''
        media = null
    }
}

function updateMedia() {
    if (!!media) {
        media.style.transform = `scale(${scale}) translateY(${yshift}px)`
    }
}

function openSelectedMedia(id) {
    closeMedia()
    pop.style.backgroundColor = '#000a'

    if (!!iframe){
        iframe.removeEventListener("load", onloadEvent, true)
    }

    iframe = document.createElement('iframe')
    iframe.src = "https://rule34.xxx/index.php?page=post&s=view&id="+id
    iframe.style.display = 'none'
    
    document.body.appendChild(iframe)
    
    onloadEvent = (e) => {
        
        let idoc = iframe.contentWindow.document

        let queryMedia = idoc.querySelector("#image") || idoc.querySelector("video")

        media = queryMedia.cloneNode(true)

        if (queryMedia.tagName.toLowerCase() === "video") {
            media.setAttribute("controls", true)
            media.setAttribute("autoplay", true)
        }
        
        media.style.pointerEvents = "initial"
        media.style.height = 'auto'
        media.style.width = 'auto'
        media.style.transition = 'all 0.05s'
        
        media.style.resize = 'both'
        media.style.overflow = 'auto'

        pop.appendChild(media)
        
        link = document.createElement('a')
        link.href = iframe.src
        link.innerHTML = "Post link"
        link.style.position = 'fixed'
        link.style.bottom = '0'
        link.style.fontSize = '1.1rem'
        link.style.pointerEvents = "initial"
        link.style.backgroundColor = "#394c36"
        link.style.color = "#aecdaa"
        link.style.padding = "0.8rem 1rem"
        link.style.zIndex = '100001'
        
        pop.appendChild(link)
        updateMedia()
    }

    iframe.addEventListener('load', onloadEvent)
}


document.addEventListener('keydown', (e) => {
    // console.log(e.key)
    if (e.target.tagName.toLowerCase() !== "input"){
        if ((e.key === 'd' || e.key == 'ArrowRight') && selectedLinkIndex < mediaLinks.length && (!iframe || iframe.contentWindow.document.readyState  == 'complete')) {
            e.preventDefault()
            selectedLinkIndex += 1
            selectLink(mediaLinks[selectedLinkIndex])
            if (!!media) {
                mediaLinks[selectedLinkIndex].click()
            }
        } else if ((e.key === 'a' || e.key == 'ArrowLeft') && selectedLinkIndex > 0 && (!iframe || iframe.contentWindow.document.readyState  == 'complete')) {
            e.preventDefault()
            selectedLinkIndex -= 1
            selectLink(mediaLinks[selectedLinkIndex])
            if (!!media) {
                mediaLinks[selectedLinkIndex].click()
            }
        }
        if (!!media) {
            if (e.key == 'w' || e.key == 'ArrowUp') {
                e.preventDefault()
                yshift += 40
                updateMedia()
            } else if (e.key == 's' || e.key == 'ArrowDown') {
                e.preventDefault()
                yshift -= 40
                updateMedia()
            } else if ((e.key == 'q' || e.key == ',') && scale > 0.1) {
                scale -= Math.sqrt(scale)/15
                updateMedia()
            } else if ((e.key == 'e' || e.key == '.') && scale < 5) {
                scale += Math.sqrt(scale)/15
                updateMedia()
            } else if (e.key === 'Escape' || e.key == 'l') {
                closeMedia()
            }
        } else {
            if (e.key === " ") {
                e.preventDefault()
                mediaLinks[selectedLinkIndex].click()
            }
        }
    }
})