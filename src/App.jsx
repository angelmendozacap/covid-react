import React, { useState, useEffect } from 'react';
import httpClient from './plugins/axios'

const App = () => {

  const [currentCountry, setCurrentCountry] = useState('')

  const [countries, setCountries] = useState({
    countries: {}
  })

  const [covidState, setCovidState] = useState({
    confirmed: {},
    recovered: {},
    deaths: {},
    lastUpdate: ''
  })

  async function fetchStatus() {
    try {


      const { data } = await httpClient.get(currentCountry ? `/countries/${currentCountry}` : '')
      setCovidState(data)
    } catch (err) {
      if (err.response.status === 404)
        console.warn('El país no se encuentra en nuestra base de datos.')
    }

  }

  async function fetchCountries() {
    const { data } = await httpClient.get('/countries')
    setCountries(data)
  }

  useEffect(() => {
    fetchStatus()
  }, [currentCountry])

  useEffect(() => {
    fetchCountries()
  }, [])

  const LastUpdatedDate = () => {
    if (!covidState.lastUpdate) {
      return <div>Última Actualización: ---</div>
    }

    console.log(covidState.lastUpdate)
    const instanceDate = new Date(covidState.lastUpdate)

    const date = `${instanceDate.toLocaleDateString()} ${instanceDate.toLocaleTimeString()}`
    return <div>Última Actualización: {date}</div>
  }

  return (
    <main>
      <section>
        <h1>Estado del Coronavirus en el Mundo</h1>

        <select onChange={e => setCurrentCountry(e.target.value)} defaultValue="">
          <option disabled value="">Selecciona un País</option>
          {
            Object.keys(countries.countries).map((country, index) => (
              <option
                key={countries.countries[country] + index}
                value={countries.countries[country]}
              >{country}</option>
            ))
          }
        </select>

        <LastUpdatedDate />

        <article>
          <h2>Casos Confirmados</h2>

          <p>
            {covidState.confirmed.value}
          </p>
        </article>

        <article>
          <h2>Recuperados</h2>

          <p>
            {covidState.recovered.value}
          </p>
        </article>

        <article>
          <h2>Muertos</h2>

          <p>
            {covidState.deaths.value}
          </p>
        </article>

        <div>
          <img src={currentCountry ? `${process.env.REACT_APP_API_URL_COVID}/countries/${currentCountry}/og` : `${process.env.REACT_APP_API_URL_COVID}/og`} alt="Country Status" />
        </div>
      </section>
    </main>
  );
}

export default App;
