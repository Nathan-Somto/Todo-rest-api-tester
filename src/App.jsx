import './App.css'
import TestResults from './components/TestResults'
import Loading from './components/Loading'
import React, { useState } from "react";
import tests from './data/tests.json'
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  /**
   * 
   * @todo test for the response gotten from the api.
   */
  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };

  const handleTest = async (e) => {
    e.preventDefault();
    if(results.length > 0){
      setResults([]);
    }
    setUrl('');
    setLoading(true);
    try {
        let newUrl = url;
        newUrl = newUrl[newUrl.length-1] !== '/' ? newUrl+='/':newUrl;
        const passed = newUrl.endsWith('/api/');
        const title = "Contains /api"
        const description = "the todo rest api base url must end with  /api"
        setResults((prevResults)=>[...prevResults,{title,description,passed}])
        if (!passed){
          return;
        }
      // GET endpoint test
      try {
        const response = await axios.get(`${newUrl}todos`);
        const data = response.data;
        const passed =
          response.status === 200 &&
          Array.isArray(data.todos) &&
          data.status === "success";
        const title = "GET /api/todos";
        const description="i should get all the todos for your api"
        setResults((prevResults) => [...prevResults, { title, passed, description }]);
      } catch (error) {
        console.error(error);
        setError(true);
      }

      // POST endpoint test
      try {
        const newTodo = {
          title: "Test Todo",
          description: "simple test",
        };
        const response = await axios.post(`${newUrl}todos`, newTodo);
        const data = response.data;
        const passed =
          data.todo.title === "Test Todo" &&
          data.todo.completed === false &&
          data.todo.description === "simple test"&&
          data.todo.id
          ;
        const title = "POST /todos";
      const description ="when i post a todo i should get back all the info i have posted"
        setResults((prevResults) => [...prevResults, { title, passed, description }]);
      
        let newTodoId = data.todo.id;
      // PUT endpoint test
      try {
        const updatedTodo = { completed: true };
        const response = await axios.put(`${url}todos/${newTodoId}/status`, updatedTodo);
        const data = response.data;
        const passed =
          response.status === 200 &&
          data.todo.completed === true ;
        const title = "PUT /todos/:id/status";
        const description="when i update a todo , i should get updated info."
        setResults((prevResults) => [...prevResults, { title, passed,description }]);
      } catch (error) {
        console.error(error);
        setError(true);
      }

      // PATCH endpoint test
      try {
        const updatedTodo = {
          title: "Patched Todo",
          description: "simple test for patching.",
        };
        const response = await axios.patch(`${url}todos/${newTodoId}`, updatedTodo);
        const data =  response.data;
        const passed =
          response.status === 200 &&
          data.todo.title === "Patched Todo" &&
          data.todo.description === "simple test for patching.";
        const title = "PATCH /todos/:id";
        const description= "I should get the description and title of my patched todo."
        setResults((prevResults) => [...prevResults, { title, passed ,description}]);
      } catch (error) {
        console.error(error);
        setError(true);
      }
      // Delete endpoint test.
      try{
        /* {deleted: 25, status: 'success'} */
            const response = await axios.delete(`${url}todos/${newTodoId}`);
            const data = response.data;
            const passed = 
            data.status==="success"&&
            data.deleted == newTodoId;
            const title = "DELETE todos/:id";
            const description= "I should recieve the id of my deleted todo"
            setResults((prevResults) => [...prevResults, { title, passed, description }]);
      }
      catch(err){
        console.error(error);
        setError(true);
      }
    }
    catch(error){
        console.error(error);
        setError(true);
    }

    }catch (error) {
        setError(true);
    } finally {
        setLoading(false);
    }
    
  };
  
 
  return (
    <>
    <nav>
      <div>{/* Google developres logo */}</div>
      <div>Todo rest api</div>
    </nav>
    <div className="main__container">
        <h1>Test your todo rest api</h1>
        <form>
       <label htmlFor="url">
      <input type="text" value={url} onChange={handleUrlChange} name="url" id="url" placeholder="enter your Todo api base url"/>
        </label>   
        <button onClick={handleTest} disabled={loading}>Test Endpoints</button>
        </form>
        <div>
    {results.length ?  <TestResults results={results} />: (<div>
          <code>
            /**
            * Test Output comes here
             */
          </code>
      </div>)}
    {loading && <Loading/>}
    {error && <div>There was an error while testing the api... </div>}
    <div>
        <h3>Tests</h3>
        <div className='tests__container'>
          {
            tests.tests.map((info, index)=>(
            <div className='tests__body' key={`${info}-${index}`}>
              <div>
              <svg height="50" viewBox="0 0 200 200" width="50" xmlns="http://www.w3.org/2000/svg"><g>
              <circle cx="100" cy="99" fill="#fff" r="95" stroke="var(--primary-color)" strokeDasharray="null">
                </circle><svg height="200" viewBox="-13 -12 50 50" width="200" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1c0-.552.448-1 1-1h6c.553 0 1 .448 1 1s-.447 1-1 1h-6c-.552 0-1-.448-1-1zm13 20.554c0 1.284-1.023 2.446-2.424 2.446h-13.153c-1.4 0-2.423-1.162-2.423-2.445 0-.35.076-.709.242-1.057l3.743-7.856c1.04-2.186 2.015-4.581 2.015-7.007v-1.635h2l-.006 2c-.087 2.623-1.09 5.092-1.973 7h3.682l4.377 9h1.496c.309 0 .52-.342.377-.644l-3.743-7.854c-1.046-2.197-2.12-4.791-2.21-7.502v-2h2v1.635c0 2.426.975 4.82 2.016 7.006l3.743 7.856c.165.348.241.707.241 1.057zm-12-1.054c0-.829-.671-1.5-1.5-1.5s-1.5.671-1.5 1.5.671 1.5 1.5 1.5 1.5-.671 1.5-1.5zm2-3.5c0-.553-.448-1-1-1-.553 0-1 .447-1 1s.447 1 1 1c.552 0 1-.447 1-1zm3 3c0-.552-.448-1-1-1s-1 .448-1 1 .448 1 1 1 1-.448 1-1z" fill="var(--primary-background)"></path></svg></g></svg>
              </div> 
              <p>{info}</p>
              </div>
            ))
}
        </div>
    </div>
        </div>
    </div>
    </>
  );
}

export default App; 