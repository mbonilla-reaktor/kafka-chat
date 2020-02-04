import React, {useEffect, useState } from "react";

import withLayout from "../components/Layout";
import useSocket from "../hooks/useSocket";

const Page = () => {

    const { socket } = useSocket();
    const [text, setText] = useState("")
    const [messages, setMessages] = useState([])

    const submit = (e) => {
        e.preventDefault()
        console.log("sending message", text)
        socket.current.emit("message", text)
        setText('')
    }

    useEffect(() => {
        socket.current.on("chat-message", setMessages)

        socket.current.emit("roomJoined", 'my-room')

        return () => socket.current.removeListener("chat-message", setMessages)
    }, [])

    return (<>
        <p>Let's chat together!</p>
        <div>
            This is the conversation:
        </div>
        {messages.map((text, key) => <p key={key}>{text}</p>)}

        <form onSubmit={submit}>
            <input onChange={(e) => setText(e.target.value)} value={text} placeholder="write here. . ."/>
            <button onClick={submit}>Send</button>
        </form>
    </>);
}

export default withLayout(Page);
