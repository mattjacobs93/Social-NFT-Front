import ChatHistoryContainer from "./ChatHistoryContainer"
import MessageContainer from "./MessageContainer"
import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom"
import { getChatHistories, createChatHistory, addMessage } from "../../services/messageService"
import { getSelectProfiles } from "../../services/profileService"

//console.log('hello world')

const Messages = ({ profile }) => {
  const [allChatHistories, setAllChatHistories] = useState([])
  const [activeChatHistory, setActiveChatHistory] = useState()
  const [upToDateProfiles, setUpToDateProfiles] = useState()
  //const [activeChatHistory, setActiveChatHistory] = useState()
  let params = useParams()
  
  const initActiveChatHistory = async (othersProfileID, allChatHistories) => {
   //console.log('init - allchathistories: ', allChatHistories)
    if (othersProfileID == profile._id) return 
    let activeChatHistory = allChatHistories.filter(chatHistory => {
      try {
        if (chatHistory?.chatHistoryMembers?.includes(othersProfileID)) {
          return true
        } else {
          return false
        }
      } catch (error) {
        return false
      }
    })[0]

    if (activeChatHistory) {
      //console.log('returned active chat history: ', activeChatHistory)
      setAllChatHistories(allChatHistories)
      setActiveChatHistory(activeChatHistory)
      return activeChatHistory
    } else {
      let createdChatHistory = await createChatHistory({othersProfileID})
      setAllChatHistories([...allChatHistories, createdChatHistory])
      setActiveChatHistory(activeChatHistory)
      return activeChatHistory
    }

  }

  const getUpToDateProfiles = async (chatHistories) => {
    //console.log('hi')
    let profileSet = new Set()
    for (let chatHistory of chatHistories) {
      for (let profileID of chatHistory.chatHistoryMembers) {
        if (profileID) profileSet.add(profileID)
      }
    }
    let profileList = [...profileSet]
    //console.log('profile set: ', profileSet)
    //console.log('about to call get select profiles service')
    let populatedProfiles = await getSelectProfiles(profileList) 
    //console.log('populated profiles', populatedProfiles)
    return populatedProfiles
  }

  const upDateChatHistories = (upDatedActiveChatHistory) => {
    let tempAllChatHistories = allChatHistories.map(chatHistory => {
      if (chatHistory._id == upDatedActiveChatHistory._id) {
        return upDatedActiveChatHistory
      } else {
        return chatHistory
      }
    })

    setAllChatHistories(tempAllChatHistories)
  }

  const handleAddMessage = (messageDataObject) => {
    //console.log('message to add: ', message)
    addMessage(messageDataObject)
    .then(upDatedActiveChatHistory => {
      if (upDatedActiveChatHistory) {
        setActiveChatHistory(upDatedActiveChatHistory)
        upDateChatHistories(upDatedActiveChatHistory)
      }
    })
  }

  useEffect(()=>{
   getChatHistories()
   .then(tempAllChatHistories => initActiveChatHistory(params.id, tempAllChatHistories))
   
   

  //  .then(tempAllChatHistories => {setAllChatHistories(tempAllChatHistories); return tempAllChatHistories})
  //  .then((tempAllChatHistories)=>initActiveChatHistory(params.id, tempAllChatHistories))
  //  .then(tempActiveChatHistory => setActiveChatHistory(tempActiveChatHistory))
   
 },[])

 useEffect(()=>{
   getUpToDateProfiles(allChatHistories)
   .then(populatedProfiles => setUpToDateProfiles(populatedProfiles))
 },[allChatHistories])


  // useEffect(()=>{
  //   let returned = initActiveChatHistory(params.id)
  //   console.log('returned: ', returned)
  // },[allChatHistories])
  // console.log('our params: ', params)
  

  return (
    <div>
      <h1>All Chat Histories Length: {allChatHistories?.length}</h1>
      <ChatHistoryContainer activeChatHistory={activeChatHistory} profile={profile} allChatHistories={allChatHistories} upToDateProfiles={upToDateProfiles} setActiveChatHistory={setActiveChatHistory}/>
      <MessageContainer activeChatHistory={activeChatHistory} profile={profile} handleAddMessage={handleAddMessage}/>
    </div>
  )
}

export default Messages