import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const URL = 'http://files.olo.com/pizzas.json'

class App extends Component{
  constructor(props){
    super(props);
    this.state = {
      pizzas:[],
      loading: false,
      err:null
    };
  }

  componentDidMount(){
    this.setState({loading: true})

    axios.get(URL)
      .then((result) => {

         var sortPizzas = []
         for(var i=0; i < result.data.length; i++){
           result.data[i].toppings.sort()
           sortPizzas.push(result.data[i].toppings.join(', '))
         }
         sortPizzas.sort()

         var counterPizzas = []
         var dup = sortPizzas.slice(0)

         for (var j = 0; j < sortPizzas.length; j++) {
           var counter = 0
            for (var m = 0; m < dup.length; m++) {
              if (sortPizzas[j] === dup[m]) {
                counter++
                delete dup[m]
              }
            }
            if (counter > 0) {
              var p = {}
              p.toppings = sortPizzas[j]
              p.counter = counter
              counterPizzas.push(p)
            }
          }

          counterPizzas.sort(
            function(a,b){
              // not working for some reason...
              //return a.counter.toString().localeCompare(b.counter)
              if (a.counter > b.counter)
                return -1;
              if (a.counter < b.counter)
                return 1;
              return 0;
            }
          )

        this.setState({
          pizzas: counterPizzas,
          loading:false
        })
      })
      .catch(err => this.setState({
        err,
        loading:false
      }))
  }

  render(){
    const { pizzas, loading, err } = this.state

    if (err) {
      return <p>{err.message}</p>
    }

    if(loading){
      return <p>Loading...</p>
    }

    return(
      <div>
        <ul>
          {pizzas.slice(0,20).map((pizza,index) =>
            <li key={index}>
              {pizza.counter} - {pizza.toppings}
            </li>
          )}
        </ul>
      </div>  
    )
  }
}

export default App;
