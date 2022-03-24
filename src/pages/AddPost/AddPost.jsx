import { useState, useRef, useEffect } from "react"

const AddPost = (props) => {
  const formElement = useRef()


  const [formData, setFormData] = useState({
    images: "",
    caption: ""
  })


  const handleChange = evt => {
    console.log(evt.target.caption)
    setFormData({...formData, [evt.target.name]: evt.target.value})
  }


  const handleSubmit = evt => {
    evt.preventDefault()
    console.log('hi')
		const postFormData = new FormData()
		postFormData.append('images', formData.images)
    postFormData.append('caption', formData.caption)
    console.log('sanity check - in add post - handle submit')
    console.log('post form data: ', postFormData)
    props.handleAddPost(formData)
    console.log('form Data in addpost', formData)
  }

  return (
    <div>
      <form action="" ref={formElement} onSubmit={handleSubmit} onChange={handleChange}>
        <input type="file" name="images" />
        <input type="text" placeholder="caption" name="caption" />
        <button type="submit">submit</button>
      </form>
  
    </div>
  )
}

export default AddPost