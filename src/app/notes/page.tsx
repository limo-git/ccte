"use client"
import { useEffect, useState, useRef } from 'react';
import ReactPlayer from 'react-player/youtube';
import JoditEditor from 'jodit-react';
import axios from 'axios';
import sanitizeHtml from 'sanitize-html';


interface Note {
  id: number;
  timestamp: number;
  date: string;
  content: string;
}

function Notes() {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoId, setVideoId] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const editor = useRef(null)
  const [content,setContent] = useState("")
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const playerRef = useRef<ReactPlayer>(null);
 
 




  const loadNotes = (videoId: string) => {
    const storedNotes = localStorage.getItem(`notes-${videoId}`);
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  };

  const saveNotes = (notes: Note[]) => {
    localStorage.setItem(`notes-${videoId}`, JSON.stringify(notes));
  };

  const addNote = () => {
    if (playerRef.current) {
      const currentTime = playerRef.current.getCurrentTime();
      
const sanitizedContent = sanitizeHtml(content, {
  allowedTags: ['b', 'i', 'u', 'a', 'ul', 'ol', 'li'],
  allowedAttributes: {
    'a': ['href', 'target'], // Allow href and target attributes on anchor tags
  },
});
      const newNote: Note = {
        id: Date.now(),
        timestamp: currentTime,
        date: new Date().toLocaleString(),
        content: sanitizedContent,
      };
      const updatedNotes = [...notes, newNote];
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setContent('');
    }
  };

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };

  const editNote = (id: number) => {
    const noteToEdit = notes.find(note => note.id === id);
    if (noteToEdit) {
      setContent(noteToEdit.content);
      setEditingNote(noteToEdit);
    }
  };

  const saveEditNote = () => {
    if (editingNote) {
      const updatedNotes = notes.map(note => note.id === editingNote.id ? { ...note, content: content } : note);
      setNotes(updatedNotes);
      saveNotes(updatedNotes);
      setEditingNote(null);
      setContent('');
    }
  };

  const handleNoteClick = (timestamp: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(timestamp, 'seconds');
    }
  };

  const fetchVideoInfo = async (videoId: string) => {
    try {
      const response = await axios.get(`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${process.env.YOUTUBE_API_KEY}&part=snippet`);
      const videoData = response.data.items[0].snippet;
      
    } catch (error:any) {
      console.error('Error fetching video info:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('Request:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };
  

  
  return (
    <div>
      <div className="flex justify-start items-center mx-12 my-6">
        <h1 className="font-semibold text-3xl">Video Player with Notes</h1>
      </div>
      <div className="mx-12 h-[52rem] rounded-2xl">
        <ReactPlayer ref={playerRef} url={videoUrl} width="100%" height="100%" controls />
      </div>
      <div className="mx-12 my-6">
        <h1 className="font-semibold">Video Title</h1>
        <p className="my-4">description</p>
      </div>
      <hr className="mx-12" />
  
          
      <div className="mx-12 my-6 border border-black/50 p-8 rounded-xl">
        <h1 className="font-semibold">My notes</h1>
        <p className="my-4">
          All your notes at a single place. Click on any note to go to a specific timestamp in the video.
        </p>
        <div>
         
          <JoditEditor ref={editor} value={content} onChange={newContent => setContent(newContent)}
            />
          {editingNote ? (
            <button onClick={saveEditNote} className="border-black/50 font-semibold text-black mt-4 py-3 px-8 flex justify-center items-center border rounded-xl ">
              Save Note
            </button>
          ) : (
            
            <button onClick={addNote} className="border-black/50 font-semibold text-black mt-4 pr-2 flex justify-center items-center border rounded-xl ">
             <img src="/images/add.png" className='scale-50'></img> Add New Note
            </button>
          )}
        </div> 
        <div className="mt-6">
          {notes.map(note => (
            <div key={note.id} className="border border-black/50 p-4 rounded mb-2 flex justify-between items-center">
              <div onClick={() => handleNoteClick(note.timestamp)} className="cursor-pointer">
                <div className="font-semibold">
                  {new Date(note.timestamp * 1000).toISOString().substr(11, 8)}
                </div>
                <div>{note.content}</div>
                <div className="text-sm text-gray-500">{note.date}</div>
              </div>
              <div>
                <button onClick={() => editNote(note.id)} className=" font-semibold border text-black border-black/50 px-2 py-1 rounded mr-2">
                  Edit Note
                </button>
                <button onClick={() => deleteNote(note.id)} className="border font-semibold border-black/50 text-black px-2 py-1 rounded">
                  Delete Note
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Notes;
