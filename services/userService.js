
//진짜 실행되는 함수가 있는 파일
//토큰 const jwt = require('jsonwebtoken') 넣어주기

const { DataSource } = require('typeorm');

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

  module.exports = {
    "welcome" : welcome,
    "getUsers" : getUsers,
    "SignUp" : signUp
  }

//JH# nodemon app.js
//[nodemon] 3.0.1
//[nodemon] to restart at any time, enter `rs`
//[nodemon] watching path(s): *.*
//[nodemon] watching extensions: js,mjs,cjs,json
//[nodemon] starting `node app.js`
//실행시킬때 nodemon app.js 실행해서 watching extension 으로 파일지켜본다는거다! 수정등
//app.js 코드많아서 헷갈리니까 정리해준거다
//app.js - 
//services - 회원가입,로그인,웰컴메세지등
//export - 내 파일에서 다른파일에도 실행되게하는것
//파일 내보낼때 Exports {"name ",fuction} 객체형태로 보내준다!!
//userService에 토큰,const 선언해준거,myDataSource 넣어주고 서비스를 실행시키는 콜백함수가 userService에 있으니 토큰 옮겨주는거다!
//sql 파일에 CREATE table user~ 이런문법을 적어서 demate(migration)로 명령어 쳐준다
//dbmate new create_users_table  하면 파일 생긴다 , 안에 CREATE TABLE 쭉쭉적어준다
//JS 는
//module.exports = { signUp, logIn, GetUsers}만 써줘도되는건
//둘다 이름이 같기떄문에 객체안에다가 한번만 적어줘도된당!