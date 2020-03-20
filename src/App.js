import React from 'react';
import logo from './logo.svg';
import './App.css';
import { useForm } from 'react-hook-form';

const all_data = require('./data/data.json');

export default function App() {
  const { register, handleSubmit } = useForm();
  // console.log(all_data["Tender price"])
  const onSubmit = input => {
    const building_type = all_data['Building costs'].filter(item => item.Type == input.buildingType)[0]
    const costPerm2 = building_type.info["Cost(\\u00a3)"]
    const location_factor = all_data['Regional variations'].filter(item => item.Region == input.Location)[0]["Adjustment factor"]
    const base_cost = costPerm2 * input.GIFA * location_factor/100
    const base_cost_factor = -0.051*Math.log(building_type.info["Cost(\\u00a3)"] * building_type.info["GIFA(m2)"])+1.705
    const project_cost_factor = -0.051*Math.log(base_cost)+1.705
    const value_adjustment = (project_cost_factor-base_cost_factor)/base_cost_factor
    const base_cost_after_value_adjustment = base_cost + base_cost*value_adjustment
    const current_tender_price = all_data['Tender price'].filter(item => item.Year == '2020q1')[0]["Tender price index"]
    const forecasted_tender_price = all_data['Tender price'].filter(item => item.Year == input.Startdate)[0]["Tender price index"]
    const date_adjustment = (forecasted_tender_price-current_tender_price)/current_tender_price
    const bast_cost_after_date_adjustment = base_cost_after_value_adjustment+base_cost_after_value_adjustment*date_adjustment
    const base_cost_after_extWork = bast_cost_after_date_adjustment * (1+input.ExternalWorks/100)
    const base_cost_after_risk = Math.floor(base_cost_after_extWork * (1+input.Risks/100))
    console.log(costPerm2, 
      location_factor, 
      base_cost, 
      base_cost_factor, 
      project_cost_factor, 
      value_adjustment, 
      base_cost_after_value_adjustment, 
      current_tender_price,
      forecasted_tender_price,
      date_adjustment,
      bast_cost_after_date_adjustment, 
      base_cost_after_extWork,  
      base_cost_after_risk)
    alert("Total building works cost: £"+JSON.stringify(base_cost_after_risk))
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <select name="buildingType" ref={register({ required : true})}>
        {all_data['Building costs'].map(item => (
          <option value={item.Type}>{item.Type}</option>
        ))}
      </select>
      <input name="GIFA" placeholder="GIFA(m2)" ref={register({ required : true})} />
      <select name="Location" ref={register({ required : true})}>
        {all_data['Regional variations'].map(item => (
          <option value={item.Region}>{item.Region}</option>
        ))}
      </select>
      <select name="Startdate" ref={register({ required : true})}>
          <option value="2020q1">2020q1</option>
          <option value="2020q2">2020q2</option>
          <option value="2020q3">2020q3</option>
          <option value="2020q4">2020q4</option>
          <option value="2021q1">2021q1</option>
          <option value="2021q2">2021q2</option>
          <option value="2021q3">2021q3</option>
          <option value="2021q4">2021q4</option>
          <option value="2022q1">2022q1</option>
          <option value="2022q2">2022q2</option>
          <option value="2022q3">2022q3</option>
          <option value="2022q4">2022q4</option>
      </select>
      <input name="ExternalWorks" placeholder="Allowance for external works(%)" ref={register({ required : true})} />
      <input name="Risks" placeholder="Allowance for risks(%)" ref={register({ required : true})} />

      <input type="submit" />
    </form>
  )
}
