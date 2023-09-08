
const http = require('http')
const express = require('express')
const { DataSource } = require('typeorm');

const morgan = require('morgan');
const dotenv = require('dotenv').config();
const cors = require('cors');

const app = express()
app.use(express.json()) // for parsing application/json
app.use(cors());  //  모든 request에 대해 CORS 요청 설정
app.use(morgan('combined'));  //  morgan 사용

const myDataSource = new DataSource({
 type: 'mysql', 
 host: 'localhost', 
 port: '3306',
 username: 'root',
 password: '',
 database: 'Jihyun'
})

const welcome = async(req, res) => {
    try {
      return res.status(200).json({
        "message" : "안녕하세요"
      })
    } catch(err) {
      console.log(err)
    }
  }
  
  
  const getUsers = async(req, res) => {
      try {
      
      const userData = await myDataSource.query(`SELECT id, name, email, password FROM users`) 
  
      // console 출력
      console.log("USER DATA :", userData)
  
      // FRONT 전달
      return res.status(200).json({
        "users": userData
      })
      } catch (error) {
          console.log(error) 
      }
  }
  
  const signUp = async(req, res) => {
    try {
      const {body} = req; 
      console.log(body);
    
      const {name, password, email} = body; 
    
      if((name === undefined) || (password === undefined) || (email === undefined)) {
        const error = new Error('가입 정보 에러') 
        error.statusCode = 400;
        throw error 
      }
      
      if(password.length < 8) {
        const error = new Error('비밀번호가 짧습니다')
        error.statusCode = 400;
        throw error
      }
  
      if((!email.includes('@')) || (!email.includes('.'))) {
        const error = new Error('이메일 에러')
        error.statusCode = 400;
        throw error; 
      }
  
      const existingUser = await myDataSource.query(`
        SELECT id, email FROM users WHERE email='${email}';
      `)
      
      if (existingUser.length > 0) { 
        const error = new Error("이메일 중복")
        error.statusCode = 400
        throw error
      }
      
  
      console.log('existing user: ', existingUser)
      
      
  
      const userData = await myDataSource.query(`
      INSERT INTO users(name, password, email) 
      VALUES('${name}', '${password}', '${email}')`)
      
      console.log("userData:", userData)
  
      return res.status(201).json({
        "message": "가입 완료!"
      })
    } catch(err) {
      console.log(err)
      if(err.statusCode === 400) {
        return res.status(400).json({
          "message": "가입 에러"
        })
      }
    }
  }


  //  run API  
app.get("/", welcome);


//1. API 로 users 보여주기, 뿌려주기
app.get('/users', getUsers);


//2. users 생성 - 수정
app.post('/users', signUp);



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