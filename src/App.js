import React from "react";

import Firebase from "firebase";
import config from "./config";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faTrashAlt, faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons'

class App extends React.Component {
  constructor(props) {
    super(props);
    Firebase.initializeApp(config);

    this.state = {
      freezerItems: [],
      updatedDate: '',
      formActive: false
    };
  }

  componentDidMount() {
    this.getUserData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState !== this.state) {
      this.writeUserData();
    }
  }

  writeUserData = () => {
    Firebase.database()
      .ref("/")
      .set(this.state);
    // console.log("DATA SAVED");
  };

  getUserData = () => {
    let ref = Firebase.database().ref("/");
    ref.on("value", snapshot => {
      const state = snapshot.val();
      this.setState(state);
    });
  };

  clearInputs = () => {
    this.refs.name.value = "";
    this.refs.count.value = "";
    this.refs.uid.value = "";
  }

  handleSubmit = event => {
    event.preventDefault();
    let name = this.refs.name.value;
    let count = this.refs.count.value;
    let uid = this.refs.uid.value;
    let date = new Date().toLocaleDateString();

    if (uid && name && count) {
      const { freezerItems } = this.state;
      const freezerItemIndex = freezerItems.findIndex(data => {
        return data.uid === uid;
      });
      freezerItems[freezerItemIndex].name = name;
      freezerItems[freezerItemIndex].count = count;
      this.setState({ freezerItems });
      this.setState({ updatedDate: date });
    } else if (name && count) {
      const uid = new Date().getTime().toString();
      const { freezerItems } = this.state;
      freezerItems.push({ uid, name, count });
      this.setState({ freezerItems });
      this.setState({ updatedDate: date });
    }

    // this.refs.name.value = "";
    // this.refs.count.value = "";
    // this.refs.uid.value = "";
    this.clearInputs();
  };

  removeData = item => {
    const { freezerItems } = this.state;
    const date = new Date().toLocaleDateString();
    const newState = freezerItems.filter(data => {
      return data.uid !== item.uid;
    });
    this.setState({ freezerItems: newState, updatedDate: date });
  };

  updateData = item => {
    this.refs.uid.value = item.uid;
    this.refs.name.value = item.name;
    this.refs.count.value = item.count;
  };

  incrementCount = item => {
    const { freezerItems } = this.state;
    const date = new Date().toLocaleDateString();
    this.refs.uid.value = item.uid;
    this.refs.name.value = item.name;
    this.refs.count.value = ++item.count;
    this.setState({ freezerItems, updatedDate: date });
    this.clearInputs();
  };

  decrementCount = item => {
    const { freezerItems } = this.state;
    const date = new Date().toLocaleDateString();
    this.refs.uid.value = item.uid;
    this.refs.name.value = item.name;
    this.refs.count.value = --item.count;
    this.setState({ freezerItems, updatedDate: date });
    this.clearInputs();
  };

  addMoreShow = event => {
    // event.preventDefault();
    // this.setState({ formActive: true });
    this.setState(prevState => ({ formActive: !prevState.formActive }));
  }

  render() {
    const { freezerItems } = this.state;
    const { updatedDate } = this.state;
    const { formActive } = this.state;
    return (
      <React.Fragment>
        <div className="container">
          <div className="title-wrapper">
            <h1>What's in the freezer?</h1>
            <p>Last updated: { updatedDate } </p>
          </div>
          <div className="items-wrapper">
            <div className="item-inner">
              { freezerItems.map(item => (
                <div
                  key={ item.uid }
                >
                  <div className="item">
                    <h5 className="title">{ item.name }</h5>
                    <div className="count-actions">
                      <button
                        onClick={() => this.decrementCount(item)}
                      >
                        <FontAwesomeIcon icon={faMinusCircle} />
                      </button>
                      <p className="amount">{item.count}</p>
                      <button
                        onClick={() => this.incrementCount(item)}
                        className="btn btn-link"
                      >
                        <FontAwesomeIcon icon={faPlusCircle} />
                      </button>
                    </div>
                    <div className="actions">
                      <button
                        onClick={() => this.removeData(item)}
                        className="btn btn-link delete"
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </button>
                      <button
                        onClick={() => this.updateData(item)}
                        className="btn btn-link"
                      >
                        <FontAwesomeIcon icon={faPencilAlt} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="add-more">
            <div className={` ${formActive ? 'form-active' : 'form-inactive'}`}>
              <h3 onClick={ this.addMoreShow }>Add new freezer item</h3>
              <form onSubmit={ this.handleSubmit } className='form'>
                <div>
                  <input type="hidden" ref="uid" />
                  <div>
                    <label>Name</label>
                    <input
                      type="text"
                      ref="name"
                      className="form-control"
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label>Count</label>
                    <input
                      type="number"
                      ref="count"
                      className="form-control"
                      placeholder="Count"
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
