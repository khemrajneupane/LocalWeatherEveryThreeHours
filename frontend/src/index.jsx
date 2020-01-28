import React from "react";
import ReactDOM from "react-dom";

// const baseURL = process.env.ENDPOINT;

const getWeatherFromApi = async () => {
  try {
    const response = await fetch("http://localhost:3003/api/weather");
    console.log(response.data);
    return response.json();
  } catch (error) {
    console.error(error);
  }

  return {};
};

class Weather extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      icon: ""
    };
  }

  async UNSAFE_componentWillMount() {
    const weather = await getWeatherFromApi();
    this.setState({ icon: weather.icon.slice(0, -1) });
  }

  render() {
    const { icon } = this.state;

    return (
      <div className="icon">
        <div>helo world</div>
        {icon && <img src={`/img/${icon}.svg`} alt="weatherimg" />}
      </div>
    );
  }
}

ReactDOM.render(<Weather />, document.getElementById("app"));
