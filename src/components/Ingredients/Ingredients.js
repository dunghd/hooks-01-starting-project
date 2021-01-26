import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import IngredientList from './IngredientList'
import Search from './Search';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    fetch('https://react-hooks-update-3cb3b-default-rtdb.firebaseio.com/ingredients.json')
      .then(res => res.json())
      .then(resData => {
        const loadedIngredients = [];
        for(const key in resData) {
          loadedIngredients.push({
            id: key,
            title: resData[key].title,
            amount: resData[key].amount
          });
        }
        setUserIngredients(loadedIngredients);
      });
  }, []);

  useEffect(() => {
    console.log('RENDERING INGREDIENTS', userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback(filteredIngredients => {
    setUserIngredients(filteredIngredients);
  }, [setUserIngredients]);

  const addIngredientHandler = ingredient => {
    fetch('https://react-hooks-update-3cb3b-default-rtdb.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(res => {
      return res.json().then(resData => {        
        setUserIngredients(prevIngredients => [
          ...prevIngredients, 
          { id: resData.name,...ingredient }
        ]);
      });
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList 
          ingredients={userIngredients} 
          onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
