const socket = io();
const $form = document.getElementById("form");
const $sendLocation = document.getElementById("sendLocation");
const $input = document.querySelector("input");
const $button = document.querySelector("button");
const $messages = document.querySelector("#messages");

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoScroling = () => {
    // New message element
    const $newMessage = $messages.lastElementChild

    // Height of the new message
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    // Visible height
    const visibleHeight = $messages.offsetHeight

    // Height of messages container
    const containerHeight = $messages.scrollHeight

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        //If you want to keep autoscrolling with new message keep Autoscrollig 
        $messages.scrollTop = $messages.scrollHeight
    }


}

//console.log({ username, room })
//TEMPLETE MESSAGE 
const templetemessage = document.querySelector("#templete-message").innerHTML;
const templetelocation = document.querySelector("#templete-location").innerHTML;
const templetesideBar = document.querySelector("#templete-sideBar").innerHTML;

socket.on("messageLocation", ({ username, location, createdAt } = {}) => {

    const html = Mustache.render(templetelocation, { username, location, createdAt: moment(createdAt).format("H:mm a") });
    $messages.insertAdjacentHTML("beforeend", html);
    autoScroling();
})

socket.on("message", ({ username, message, createdAt } = {}) => {

    const now = moment(createdAt).format("H:mm a")
    const html = Mustache.render(templetemessage, { username, message, now })
    $messages.insertAdjacentHTML("beforeend", html)
    autoScroling()
})

socket.on("DataRoom", ({ room, users }) => {
    html = Mustache.render(templetesideBar, { room, users });
    document.querySelector("#sideBar").innerHTML = html
})
$form.addEventListener("submit", (e) => {
    e.preventDefault();
    $button.setAttribute("disabled", "disabled");
    socket.emit("sendMessage", $input.value, (error) => {
        $button.removeAttribute("disabled");
        if (error) {
            return alert(error, $input.value)
        }
      //  console.log("message delevered from chat.js !")
    })

    $input.value = "";
    $input.focus();


})

$sendLocation.addEventListener("click", () => {
    if (!navigator.geolocation) {
        console.log("you can't share your location your browser is old !")
    }
    $sendLocation.setAttribute("disabled", "disabled");

    navigator.geolocation.getCurrentPosition((position) => {

        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const location = { lat, long }

        socket.emit("sendLocation", location, (call) => {
            console.log(call)
            $sendLocation.removeAttribute("disabled");
        })
    })
})

socket.emit("join", { username, room }, (error) => {
    if (error) {
        alert(error);
        location.href = "/";
    }

})
// socket.on("countUpdated",(count)=>{
//     console.log("cout Has been Updated ",count);
// })

// document.querySelector("#increment").addEventListener("click",()=>{
//     console.log("clicked");
//     socket.emit('increment')
// })