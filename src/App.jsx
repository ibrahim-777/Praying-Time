import './App.css'
import MainProject from './Components/MainProject'
import Container from "@mui/material/Container";
function App() {
  return (
    <>
    <div style={{
    justifyContent:'center',
    display:"flex",
    width:'100vw'}}>
      <Container>
      <MainProject/>
      </Container>
      </div>
    </>
  )
}

export default App
