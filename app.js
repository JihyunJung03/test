
//연결하고 싶은 함수 넣어둔파일
const http = require('http')
const express = require('express')

const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');
const userService = require('./services/userService');
// userService 를 여기다 담겠다( 함수 실행되도록)

console.log("USER SERVICE: ", userService)
console.log("signUp fuction ", userService.SignUp)
//signup 이라는 함수는 뒤에경로에서 오기때문에 경로적어줘야함
//모듈이름이 거의 객체이름이다

const app = express()
app.use(express.json()) // for parsing application/json
app.use(cors());  //  모든 request에 대해 CORS 요청 설정
app.use(morgan('combined'));  //  morgan 사용




//  run API  
app.get("/", userService.welcome);
//userService안에 welcomd

//1. API 로 users 보여주기, 뿌려주기
app.get('/users', userService.getUsers);
//userService안에 getUsers

//2. users 생성 - 수정
app.post('/users', userService.signUp);
//userService안에 signUp
//콜백함수는 뒤에다가 실행시켜주지말고 대기타는중이라 return안적어줌

const server = http.createServer(app) 
const serverPort = 8000

const start = async () => { 
  try {
    server.listen(serverPort, () => console.log(`Server is listening on ${serverPort}`))
  } catch (err) { 
    console.error(err)
  }
}

myDataSource.initialize()
 .then(() => {
    console.log("Data Source has been initialized!")
 })

start()
