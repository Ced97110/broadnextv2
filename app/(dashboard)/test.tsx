import React, { useState, useEffect } from 'react';

function App() {
  const [data, setData] = useState(null);
  const [dataInterest, setDataInterest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newCompanyId, setNewCompanyId] = useState('');
  const [newCompanyInterestId, setNewCompanyInteresteId] = useState('');
  const [newComp, setNewComp] = useState('');
  const [postResult, setPostResult] = useState(null);
  const [postInterestedResult, setInterestedResult] = useState(null);

  const fetchData1 = async () => {
    try {
      const response = await fetch('https://i0yko8ncze.execute-api.us-east-2.amazonaws.com/Prod/Company/List?CompName=c');
      const result = await response.json();
      setData(result.slice(0, 5)); // Fetch the first 5 companies
    } catch (error) {
      console.error('Error fetching data:', error);
      setData('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      const response = await fetch('https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/Dashboard');
      const result = await response.json();
      setData(result.Watched.slice(0, 10)); // Fetch the first 10 companies
      setDataInterest(result.Interested.slice(0, 10)); // Fetch the first 10 companies
    } catch (error) {
      console.error('Error fetching data:', error);
      setData('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  function addToWatchlist(companyId) {
    // Define the base URL
    const baseUrl = 'https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/AddCompanyToWatchlist';

    // Construct the URL with the CompanyId as a query parameter
    const urlWithParams = `${baseUrl}?CompanyId=${companyId}`;

    // Make the POST request with the modified URL
    fetch(urlWithParams, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        setPostResult(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }

  function addToInterestlist(companyId) {
    // Define the base URL
    const baseUrl = 'https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/AddCompanyToInterestedlist';

    // Construct the URL with the CompanyId as a query parameter
    const urlWithParams = `${baseUrl}?CompanyId=${companyId}`;

    // Make the POST request with the modified URL
    fetch(urlWithParams, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        setInterestedResult(data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }

  function removeCompany(companyId) {
    // Define the base URL
    const baseUrl = 'https://ajstjomnph.execute-api.us-east-2.amazonaws.com/Prod/usermanagement/RemoveCompany';

    // Construct the URL with the CompanyId as a query parameter
    const urlWithParams = `${baseUrl}?CompanyId=${companyId}`;

    // Make the POST request with the modified URL
    fetch(urlWithParams, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>API Data Fetching Data and Sending Some Example</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            <div>
              <h2>Watched Comps:</h2>
              <ul>
                {data &&
                  data.map((company) => (
                    <li key={company.Id}>
                      <strong>{company.Name} ({company.Id}) </strong>: {company.Ticker}
                    </li>
                  ))}
              </ul>
            </div>

            <div>
              <h2>Interested Comps:</h2>
              <ul>
                {dataInterest &&
                  dataInterest.map((company) => (
                    <li key={company.Id}>
                      <strong>{company.Name} ({company.Id}) </strong>: {company.Ticker}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}

        <h2>Add to watchlist</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addToWatchlist(newCompanyId);
          }}
        >
          <div>
            <label>Company:</label>
            <input
              type="text"
              value={newCompanyId}
              onChange={(e) => setNewCompanyId(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>

        {postResult && (
          <div>
            <h3>Post Result:</h3>
            <pre>{JSON.stringify(postResult, null, 2)}</pre>
          </div>
        )}

        <h2>Add to interested</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addToInterestlist(newCompanyInterestId);
          }}
        >
          <div>
            <label>Company:</label>
            <input
              type="text"
              value={newCompanyInterestId}
              onChange={(e) => setNewCompanyInteresteId(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>

        {postInterestedResult && (
          <div>
            <h3>Post Result:</h3>
            <pre>{JSON.stringify(postInterestedResult, null, 2)}</pre>
          </div>
        )}

        <h2>Remove Company</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            removeCompany(newComp);
          }}
        >
          <div>
            <label>Company:</label>
            <input
              type="text"
              value={newComp}
              onChange={(e) => setNewComp(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      </header>
    </div>
  );
}

export default App;
