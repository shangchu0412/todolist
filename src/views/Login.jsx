import { NavLink, useNavigate } from 'react-router-dom';
import rhefZ3 from '../assets/rhefZ3.png';
import tj3Bdk from '../assets/tj3Bdk.png';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const { VITE_APP_HOST } = import.meta.env

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  function HandleChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const navigate = useNavigate()

  const [isLoading, setIsLoading] = useState(false) //預設目前沒有讀取中

  async function singIn() {
    try {
      setIsLoading(true) //當登入時，將狀態改為true
      const res = await axios.post(`${VITE_APP_HOST}/users/sign_in`, formData)
      console.log(res)
      const { token } = res.data
      console.log(token)
      document.cookie = `token = ${token}`
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        icon: "success",
        title: "登入成功"
      })
      setIsLoading(false)  //當登入完成後，將狀態改回false
      navigate('/todo')
    } catch (error) {
      if (formData.email === '' && formData.password === '') {
        Swal.fire({
          title: "帳號密碼未輸入",
          icon: 'error',
          confirmButtonText: "OK",
        })
      } else if (formData.password.length < 6) {
        Swal.fire({
          title: "密碼不得少於6個字",
          icon: 'error',
          text: error,
          confirmButtonText: "OK",
        })
      } else if(error.response.status === 401){
        Swal.fire({
          title: "帳號或密碼輸入錯誤",
          icon: 'error',
          text: error,
          confirmButtonText: "OK",
        })
      }else if (error.response.status === 404){
        Swal.fire({
          title: "用戶不存在，請前往註冊",
          icon: 'error',
          text: error,
          confirmButtonText: "OK",
        })
      }
      console.log(error.response.status)
    }
  }


  return (
    <>
      <div id="loginPage" className="bg-yellow">
        <div className="conatiner loginPage vhContainer ">
          <div className="side">
            <NavLink to='/'><img className="logoImg" src={rhefZ3} alt="" /></NavLink>
            <img className="d-m-n" src={tj3Bdk} alt="workImg" />
          </div>
          <div>
            <form className="formControls" action="index.html">
              <h2 className="formControls_txt">最實用的線上代辦事項服務</h2>
              <label className="formControls_label" htmlFor="email">Email</label>
              <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required onChange={HandleChange} />
              <label className="formControls_label" htmlFor="password">密碼</label>
              <input className="formControls_input" type="password" name="password" id="password" placeholder="請輸入密碼" required onChange={HandleChange} />
              <input className="formControls_btnSubmit" type="button" value="登入" disabled={isLoading} onClick={(e) => {
                e.preventDefault()
                singIn()
              }} />
              <NavLink to='/sing_up' className="formControls_btnLink">註冊帳號</NavLink>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default Login