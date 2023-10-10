import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import empty from '../assets/empty.png'



const { VITE_APP_HOST } = import.meta.env

//當待辦事項空白時
const Empty = () => {
  return (
    <div className="empty">
      <p className="emptyText">目前尚無待辦事項</p>
      <img src={empty} alt="empty" />
    </div>
  )
}


const List = ({ todos, getTodoList }) => {

  //頁籤
  const [tab, setTab] = useState('全部')
  //tods資料篩選
  const [filterTodos, setFilterTodos] = useState(todos)


  useEffect(() => {
    setFilterTodos(todos)
    setTab('全部')
  }, [todos])

  // 每次切換頁籤時更新篩選完的狀態
  useEffect(() => {
    if (tab == '全部') {
      setFilterTodos(todos)
    } else if (tab == '待完成') {
      setFilterTodos(todos.filter((todo) => !todo.status))
    } else if (tab == '已完成') {
      setFilterTodos(todos.filter((todo) => todo.status))
    }
  }, [tab])

  const handleList = (e) => {
    setTab(e.target.innerText)
  }

  // 切換待辦事項狀態
  const statusToggle = async (id) => {
    const res = await axios.patch(`${VITE_APP_HOST}/todos/${id}/toggle`)
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      icon: "success",
      title: "狀態已更新"
    })
    getTodoList()
  }

  // 編輯待辦事項

  const [editMode, setEditMode] = useState('')

  const [editContent, setEditContent] = useState('')

  const editTodo = async (id) => {
    try {
      const res = await axios.put(`${VITE_APP_HOST}/todos/${id}`, {
        "content": editContent
      })
      setEditMode('')
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        icon: "success",
        title: "編輯成功"
      })
      getTodoList()
    } catch (err) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        icon: "error",
        title: "編輯失敗"
      })
    }
  }

  const keyDownToUpdate = (e, id) => {
    // console.log(e.key);
    if (e.key === 'Escape') {
      setEditMode('')
      getTodoList()
    } else if (e.key === 'Enter') {
      editTodo(id)
    }
    // e.key === 'Enter' ? editTodo(id) : null
  }



  // 刪除待辦事項
  const deleteTodo = async (id) => {
    const res = await axios.delete(`${VITE_APP_HOST}/todos/${id}`)
    Swal.fire({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
      icon: "success",
      title: "刪除成功"
    })
    getTodoList()
  }

  // 清除已完成項目
  const clearFinished = () => {
    let finishedTodo = todos.filter((item) => item.status === true).length
    if (finishedTodo < 1) {
      Swal.fire({
        title: "目前無完成項目",
        icon: 'error',
        confirmButtonText: "OK",
      })
    } else {
      todos.filter((todo) => todo.status === true ?
        axios.delete(`${VITE_APP_HOST}/todos/${todo.id}`) : todo)
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        icon: "success",
        title: "清除成功"
      })
      getTodoList()
    }

  }


  return (
    <div className="todoList_list">
      <ul className="todoList_tab">
        <li style={{ cursor: "pointer" }}><a style={tab === '全部' ? { color: "#ffbf2a", borderBottom: "3px solid #ffbf2a" } : null} onClick={handleList}>全部</a></li>
        <li style={{ cursor: "pointer" }}><a style={tab === '待完成' ? { color: "#ffbf2a", borderBottom: "3px solid #ffbf2a" } : null} onClick={handleList}>待完成</a></li>
        <li style={{ cursor: "pointer" }}><a style={tab === '已完成' ? { color: "#ffbf2a", borderBottom: "3px solid #ffbf2a" } : null} onClick={handleList}>已完成</a></li>
      </ul>
      <div className="todoList_items">
        <ul className="todoList_item">
          {filterTodos.map((item) => {
            return (
              <li key={item.id}>
                <label className="todoList_label">
                  <input
                    id={item.id}
                    className="todoList_input"
                    type="checkbox"
                    value={Boolean(item.status)}
                    checked={Boolean(item.status)}
                    onChange={() => statusToggle(item.id)}
                  />
                  {editMode === item.id ? (
                    <div className="todoList_edit">
                      <input type="text"
                        className="todo-edit-input me-4"
                        value={editContent} onChange={(e) => setEditContent(e.target.value)}
                        onKeyDown={(e) => keyDownToUpdate(e, item.id)} />
                      {/* <span
                        className="material-symbols-outlined draw"
                        onClick={(e) => editTodo(item.id)}
                      >done</span>
                      <span
                        className="material-icons draw"
                        onClick={(e) => setEditMode('')}
                      >clear</span> */}
                    </div>
                  ) : (
                    <span style={{
                      color: item.stuats && "#9F9A91",
                      textDecoration: item.status && "line-through"
                    }}>{item.content}</span>
                  )
                  }

                </label>
                <a onClick={(e) => {
                  setEditMode(item.id)
                  setEditContent(item.content)
                }}>
                  <span className="material-symbols-outlined draw">edit_square</span>
                </a>
                <a onClick={(e) => deleteTodo(item.id)}>
                  <span className="material-icons draw">clear</span>
                </a>
              </li>
            )
          })}
        </ul>
        <div className="todoList_statistics">
          <p> {todos.filter((item) => item.status === true).length}個已完成項目</p>
          <a className="clearFinished" onClick={clearFinished} style={{ cursor: "pointer" }}>清除已完成項目</a>
        </div>
      </div>
    </div>
  )



}


function Todo() {

  const navigate = useNavigate()

  //存取當前使用者名稱
  const [userName, setUserName] = useState('')

  const [todos, setTodos] = useState([])

  //新增待辦事項
  const [newTodo, setNewTodo] = useState({ content: '' })

  useEffect(() => {
    const cookieValue = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]
    //token已經儲存在cookieValue變數中
    // console.log(cookieValue)


    //預設axios表頭
    axios.defaults.headers.common['Authorization'] = cookieValue

    //驗證登入
    // get帶入的資料依序為: 路徑，header
    axios.get(`${VITE_APP_HOST}/users/checkout`)
      .then(res => {
        //獲取使用者名稱
        setUserName(res.data.nickname)
        //獲取todolist資料
        getTodoList()
      })
      .catch(err => {
        Swal.fire({
          title: "驗證已過期，請重新登入",
          icon: 'error',
          confirmButtonText: "OK",
        })
        navigate('/')
      })
  }, [])

  const getTodoList = async () => {
    try {
      //取得所有代辦事項
      const res = await axios.get(`${VITE_APP_HOST}/todos`);
      // console.log(res.data.data)
      setTodos(res.data.data)
    } catch (err) {

    }
  }

  //新增待辦事項
  const createTodo = async () => {
    try {
      const res = await axios.post(`${VITE_APP_HOST}/todos/`, newTodo)
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        icon: "success",
        title: "新增成功"
      })
      getTodoList()
      setNewTodo({ content: '' })
    } catch (error) {
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        icon: "error",
        title: "新增失敗"
      })
    }
  }

  //新增欄位不可空白
  const keyDownToCreate = e => {
    if (e.key === 'Enter') {
      newTodo.content ? createTodo() :
        Swal.fire({
          title: "欄位不可空白",
          icon: 'error',
          text: error,
          confirmButtonText: "OK",
        })
    }
  }

  //登出
  const handleSignOut = async () => {
    try {
      const res = await axios.post(`${VITE_APP_HOST}/users/sign_out`, {})
      //清除token
      document.cookie = 'token=; Max-Age=-1;';
      Swal.fire({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
        icon: "success",
        title: "登出成功"
      })
      navigate('/')
    } catch (err) {
      Swal.fire({
        title: "登出失敗",
        icon: 'error',
        confirmButtonText: "OK",
      })
    }
  }




  return (
    <>
      <div id="todoListPage" className="bg-half">
        <nav>
          <h1><a>ONLINE TODO LIST</a></h1>
          <ul>
            <li className="todo_sm"><span>HI!~{userName}</span></li>
            <li><a href="#loginPage" onClick={handleSignOut}>登出</a></li>
          </ul>
        </nav>
        <div className="conatiner todoListPage vhContainer">
          <div className="todoList_Content">
            <div className="inputBox">
              <input
                type="text"
                placeholder="請輸入待辦事項"
                value={newTodo.content}
                onChange={(e) => {
                  setNewTodo({ content: e.target.value })
                }}
                onKeyDown={keyDownToCreate} />
              <a onClick={() => {
                newTodo.content ? createTodo() :
                  Swal.fire({
                    title: "欄位不可空白",
                    icon: 'error',
                    confirmButtonText: "OK",
                  })
              }}>
                <span className="material-icons addDraw">add</span>
              </a>
            </div>
            {todos.length ? (<List todos={todos} setTodos={setTodos} getTodoList={getTodoList} />) : (<Empty />)}
          </div>
        </div>
      </div>
    </>
  )
}

export default Todo