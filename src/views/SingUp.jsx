import { NavLink, useNavigate } from 'react-router-dom';
import rhefZ3 from '../assets/rhefZ3.png';
import tj3Bdk from '../assets/tj3Bdk.png';
import { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const { VITE_APP_HOST } = import.meta.env

function SingUp() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nickname: ''
  })

  function HandleChange(e) {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  async function singUp() {
    //post帶入的資料依序為: 路徑，資料，header
    try {
      const res = await axios.post(`${VITE_APP_HOST}/users/sign_up`, formData)
      console.log(res)
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        icon: "success",
        title: "註冊成功"
      })
      navigate('/')
    } catch (error) {
      Swal.fire({
        title: "註冊失敗",
        icon: 'error',
        text: error,
        confirmButtonText: "OK",
      })
    }
  }

  const navigate = useNavigate()

  return (
    <>
      <div id="signUpPage" className="bg-yellow">
        <div className="conatiner signUpPage vhContainer">
          <div className="side">
            <NavLink to='/'><img className="logoImg" src={rhefZ3} alt="" /></NavLink>
            <img className="d-m-n" src={tj3Bdk} alt="workImg" />
          </div>
          <div>
            <form className="formControls" action="index.html">
              <h2 className="formControls_txt">註冊帳號</h2>
              <label className="formControls_label" htmlFor="email">Email</label>
              <input className="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required onChange={HandleChange} />
              <label className="formControls_label" htmlFor="nickname">您的暱稱</label>
              <input className="formControls_input" type="text" name="nickname" id="nickname" placeholder="請輸入您的暱稱" onChange={HandleChange} required />
              <label className="formControls_label" htmlFor="password">密碼</label>
              <input className="formControls_input" type="password" name="password" id="password" placeholder="請輸入密碼" required onChange={HandleChange} />
              <label className="formControls_label" htmlFor="pwd">再次輸入密碼</label>
              <input className="formControls_input" type="password" name="pwd" id="pwd" placeholder="請再次輸入密碼" required />
              <input className="formControls_btnSubmit" type="button" value="註冊帳號" onClick={(e) => {
                e.preventDefault()
                singUp()
              }} />
              <NavLink to='/' className='formControls_btnLink'>登入</NavLink>
            </form>
          </div>
        </div>

      </div>
    </>
  )
}

export default SingUp