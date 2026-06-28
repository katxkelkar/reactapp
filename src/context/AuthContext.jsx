import {db,auth} from "../firebase"
import React from 'react'
import {createContext, useContext, useState, useEffect} from "react"
import {onAuthStateChanged, signOut} from "firebase/auth"
import {doc, getDoc} from "firebase/firestore"
const AuthContext = createContext(null)

export function Authprovider({children}) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(()=>{
    const unsub = onAuthStateChanged(auth, async(fbuser)=>{
      if (fbuser){
        setUser(fbuser)
        try{
          const snap = await getDoc(doc(db,"users", fbuser.id))
          setProfile(snap.exists()?snap.data():{})
        }
        catch{
          setProfile({})
        }
      }
      else {
        setProfile(null)
        setUser(null)
      }
      setLoading(false)
    })
    return unsub
  },[])
  const logOut = ()=>{
    signOut(auth)
  }
  return (
      <AuthContext.Provider value={{user,profile,loading,logOut}}>
        {!loading && children}
      </AuthContext.Provider>
  )
}
export const useAuth = ()=>useContext(AuthContext)