import React, {useState, useMemo ,useEffect} from 'react' ;
import  Result from './result'
const synth=window.speechSynthesis;

const App=() =>{
  
  const voices=useMemo(()=>synth.getVoices(),[])
  const [voiceSelected,setVoiceSelected]=useState("Google US English")
  const[text,setText]=useState("")
  const [isSpeaking,setIsSpeaking]=useState("")
  const [meanings,setMeanings]=useState([])
  const [phonetics,setPhonetics]=useState([])
  const [word,setWord]=useState("")
  const [error,setError]=useState("")
  const dictionaryApi=(text)=>{
    let url=`https://api.dictionaryapi.dev/api/v2/entries/en/${text}`;
    fetch(url)
    .then(res=>res.json())
    .then(result=>{
      console.log(result)
      setMeanings(result[0].meanings)
      setPhonetics(result[0].phonetics)
      setWord(result[0].word)
      setError("")
    })
    .catch(err=>setError(err))
  }
  const reset=() =>{
    setIsSpeaking("")
    setError("")
    setMeanings([])
    setPhonetics([])
    setWord("")
  }
  useEffect(()=>{
    if(!text.trim()) return reset();
    const debounce=setTimeout(()=>{
      dictionaryApi(text)
    },100)
    return () => clearTimeout(debounce)
  },[text])
  const startSpeech=()=>{
    const utterence=new SpeechSynthesisUtterance(text)
    const voice=voices.find(voice => voice.name === voiceSelected)
    utterence.voice=voice;
    synth.speak(utterence)
  }
  const handleSpeech =()=>{
    if(!text.trim()) return;
    if(!synth.speaking) {
      startSpeech(text)
      setIsSpeaking("speak")
    }else{
      synth.cancel()
    }
    setInterval(() => {
      if(!synth.speaking){
        setIsSpeaking("")
      }
    },100)
  }
  return(
    <div className="container">
      <h1>English Dictionary</h1>
      <form>
        <div className="row">
          <textarea  cols="30" rows="4" placeholder= 'Enter text'
          value={text} onChange={e=>setText(e.target.value)}/>
          <div className="voices-icons">
            <div className="select-voices">
              <select value={voiceSelected}
              onChange={e=>setVoiceSelected(e.target.value)}>
                {
                  voices.map(voice =>(
                    <option key={voice.name} value={voice.name}>{voice.name}</option>
                  ))
                }
              </select>
            </div>
            <i className={`fa-sharp fa-solid fa-volume-high ${isSpeaking}`} onClick={handleSpeech}></i>
          </div>

        </div>
      </form>
      {
        (text.trim()!== "" && !error) && 
        <Result word={word} 
    phonetics={phonetics}
    meanings={meanings}
    setText={setText}/>
      }
    
    </div>
  )
}
export default App;