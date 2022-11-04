//import React from "react";
import noteContext from"./noteContext";
import{ useState}from "react";

const NoteState = (props)=>{
  const host = "http://localhost:5000"
    const notesInitial = []
      const[notes ,setNotes]=useState(notesInitial)
      // get all Note

        const getNotes= async()=>{
         // to do
         // api call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method: 'GET',
          
          headers: {
            'Content-Type': 'application/json',
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMxZGFjODQwMDAxNTQ4YzMwYTE2NTNkIn0sImlhdCI6MTY2Mjg5MDg5Nn0.qce-1ueNhG4Pj0fG7YZ6yG1LhmWSACPQe7zVxK2yGeE"
          },
         
        });
        //const json = response.json(); 
         const json= await response.json()
      
          setNotes(json)
        }
        //Add a note
        const addNote = async (title,description,tag)=>{
          // api call
           const response = await fetch(`${host}/api/notes/addnote`, {
             method: 'POST',
             
             headers: {
               'Content-Type': 'application/json',
               "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMxZGFjODQwMDAxNTQ4YzMwYTE2NTNkIn0sImlhdCI6MTY2Mjg5MDg5Nn0.qce-1ueNhG4Pj0fG7YZ6yG1LhmWSACPQe7zVxK2yGeE"
             },
            
             body: JSON.stringify({title,description,tag}) 
           });
           const note = await response.json(); 
           setNotes(notes.concat(note))
          }
      // Delete a Note
        const deleteNote = async(id) =>{
            
            // api call
             const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
               method: 'DELETE',
               
               headers: {
                 'Content-Type': 'application/json',
                 "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMxZGFjODQwMDAxNTQ4YzMwYTE2NTNkIn0sImlhdCI6MTY2Mjg5MDg5Nn0.qce-1ueNhG4Pj0fG7YZ6yG1LhmWSACPQe7zVxK2yGeE"
               }
              
             });
             const json = response.json(); 
            
         const newNotes = notes.filter((note)=>{return note._id!==id})
          setNotes(newNotes)
        }
      //edit a Note
      const editNote = async (id,title,description,tag)=>{
       // api call
        const response = await fetch('${host}/api/notes/updatenote/${id}', {
          method: 'PUT',
          
          headers: {
            'Content-Type': 'application/json',
            "auth-token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjMxZGFjODQwMDAxNTQ4YzMwYTE2NTNkIn0sImlhdCI6MTY2Mjg5MDg5Nn0.qce-1ueNhG4Pj0fG7YZ6yG1LhmWSACPQe7zVxK2yGeE"
          },
         
          body: JSON.stringify({title,description,tag}) 
        });
        const json =  await response.json(); 
      let newNotes = JSON.parse(JSON.stringify(notes))
        // logic to edit in clint
            for(let index=0; index <newNotes.length; index++){
              const element = newNotes[index];
              if(element._id === id){
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
              }
            }
            setNotes(newNotes);
      }
    return (
        <noteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
          {props.children}
        </noteContext.Provider>
    )
}

export default NoteState;