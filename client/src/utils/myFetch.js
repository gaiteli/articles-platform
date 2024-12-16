// 已废弃
async function myFetch(url="", values={}) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    })
    console.log("Success:", response.data);
    return response
  } catch (error){
    console.error("Error:", error)
    throw error
  }
  
  
}

export default myFetch