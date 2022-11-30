/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from "react";
import { Col, Row, Card, Form, Button } from '@themesberg/react-bootstrap';
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {PayPalButton} from 'react-paypal-button-v2'

import { ParcelService } from "../service/ParcelService";

var totalamount=1000;

const customButton = withReactContent(Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-primary me-3'
  },
  buttonsStyling: false
}))

function toRad(Value) 
{
    return Value * Math.PI / 180;
}

const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': 'dbf9a8d3c8msh7b12824b0a8a0d9p174ff2jsn2d8d40697936',
		'X-RapidAPI-Host': 'india-pincode-with-latitude-and-longitude.p.rapidapi.com'
	}
};

const longitude = async (pincode) => {
  const res = await
  fetch('https://india-pincode-with-latitude-and-longitude.p.rapidapi.com/api/v1/pincode/'+pincode.toString(), options)
  const data = await res.json();
  console.log(data[0].lat);
  return data[0];
}



export const ParcelForm = ({ token, user }) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false);
  const [sdkReady, setsdkReady] = useState(false);
  const [name, setName] = useState({ firstName: '', lastName: ''})
  const [amount, setAmount] = useState(0);
  const [data, setData] = useState({
    email: '',
    locationTo: '',
    locationFrom: '',
    city: '',
    parcelType: '',
    weight: '',
    pincodeOrigin: '',
    pincodeDest: ''
  })

  const handleName = (e) => {
    setName({...name, [e.target.name]: e.target.value})
  }

  const handleChange = (e) => {
    setData({...data, [e.target.name]: e.target.value})
  }
  
  const finalData = {
    recipient: {name: name.firstName + ' ' + name.lastName, email: data.email},
    sender: user._id,
    price: "Rs".concat(parseInt(data.weight * 100).toString()),
    trackingCode: "IN".concat(Math.random().toString(36).slice(2, 7).toUpperCase()),
    locationFrom: data.locationFrom,
    locationTo: data.locationTo,
    weight: data.weight,
    city: data.city,
    parcelType: data.parcelType
  }

  totalamount=parseInt(data.weight * 100)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const cord1 = await longitude(parseInt(data.pincodeOrigin));
    const cord2 = await longitude(parseInt(data.pincodeDest));
    console.log(cord1);
    console.log(cord2);
    // var R = 6371; // km
    // var dLat = toRad(parseFloat(destination.lat)-parseFloat(origin.lat));
    // var dLon = toRad(parseFloat(destination.lng)-parseFloat(origin.lng));
    // var lat1 = toRad(parseFloat(origin.lat));
    // var lat2 = toRad(parseFloat(destination.lat));
    // var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    //     Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    //   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    //   var d = R * c;
    const radlat1 = (Math.PI * cord1.lat) / 180;
  const radlat2 = (Math.PI * cord2.lat) / 180;

  const theta = cord2.lng - cord1.lng;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344; //convert miles to km
  console.log(finalData.weight);
  console.log(parseInt(finalData.weight));
  
      console.log("Distance" + dist);
      totalamount = parseInt(dist*5*parseInt(finalData.weight));
      setAmount(parseInt(dist*5*parseInt(finalData.weight)))
    finalData.price = "Rs. ".concat(parseInt(dist*5*parseInt(finalData.weight)).toString());
    const res = await ParcelService.createParcel(token, finalData)
    console.log(res)
    console.log(amount)
    customButton.fire(res.status, res.message, 'success')
    setLoading(false)
  }

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)

  }
  useEffect(() => {
    //payment
    const addPayPalScript = async () => {
       const script = document.createElement('script')
       script.type= 'text/javascript'
       script.src ='https://www.paypal.com/sdk/js?client-id=Abzsiativ4qv0_6gkE8APUqvclhTs6NrOKzsVRGKG5TPE5g-yWwWm7vXl2SyEr4uEFpiFqkt0zuVliRv'
       script.async=true
       script.onload = () => {
        setsdkReady(true)
       }
       document.body.appendChild(script)
       if(!window.paypal){
        addPayPalScript()
       } else {
        setsdkReady(true);
       }
    }
    //payment
    localStorage.setItem('data', JSON.stringify(finalData))
  }, [data, name])

  return (
    <Card border="light" className="bg-white shadow-sm mb-4">
      <Card.Body>
        <h5 className="mb-4">Reciever information</h5>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control 
                required type="text" 
                placeholder="Enter recepient first name"
                name="firstName"
                defaultValue={name.firstName}
                onChange={handleName}
                 />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control required type="text" 
                placeholder="Enter recepient last name"
                name="lastName"
                defaultValue={name.lastName}
                onChange={handleName}
                 />
              </Form.Group>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col md={6} className="mb-3">
              <Form.Group id="weight">
                <Form.Label>Weight</Form.Label>
                <Form.Control required type="number" placeholder="weight"
                name="weight"
                defaultValue={setData.weight}
                onChange={handleChange}
                 />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="weight">
                <Form.Label>Courier Type</Form.Label>
                <Form.Select defaultValue="0"
                name="parcelType"
                onChange={handleChange}
                >
                  <option value="0">Courier Type</option>
                  <option value="parcel">Parcel</option>
                  <option value="shipping">shipping</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6} className="mb-3">
              <Form.Group id="emal">
                <Form.Label>Email</Form.Label>
                <Form.Control required type="email" 
                placeholder="name@company.com"
                name="email"
                defaultValue={data.email}
                onChange={handleChange}
                 />
              </Form.Group>
            </Col>
            <Col md={6} className="mb-3">
              <Form.Group id="phone">
                <Form.Label>Phone</Form.Label>
                <Form.Control required type="number"
                placeholder="+12-345 678 910" 
                name="phone"
                defaultValue={data.phone}
                onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>

          <h5 className="my-4">Address</h5>
          <Row>
            <Col sm={6} className="mb-3">
              <Form.Group id="address">
                <Form.Label>Destination Address</Form.Label>
                <Form.Control required type="text" 
                placeholder="Enter Recipient address"
                name="locationTo"
                defaultValue={data.locationTo}
                onChange={handleChange}
                 />
              </Form.Group>
            </Col>
            <Col sm={6} className="mb-3">
              <Form.Group id="addressNumber">
                <Form.Label>Sender Address</Form.Label>
                <Form.Control required type="text" placeholder="No."
                name="locationFrom"
                defaultValue={data.locationFrom}
                onChange={handleChange} 
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col sm={4} className="mb-3">
              <Form.Group id="city">
                <Form.Label>City</Form.Label>
                <Form.Control required type="text" placeholder="City"
                name="city"
                defaultValue={data.city}
                onChange={handleChange}
                 />
              </Form.Group>
            </Col>
            <Col sm={4} className="mb-3">
              <Form.Group id="pincodeOrigin">
                <Form.Label>Pincode Origin</Form.Label>
                <Form.Control required type="text" placeholder="Origin"
                name="pincodeOrigin"
                defaultValue={data.pincodeOrigin}
                onChange={handleChange}
                 />
              </Form.Group>
            </Col>
            <Col sm={4} className="mb-3">
              <Form.Group id="pincodeDest">
                <Form.Label>Pincode Destination</Form.Label>
                <Form.Control required type="text" placeholder="Destination"
                name="pincodeDest"
                defaultValue={data.pincodeDest}
                onChange={handleChange}
                 />
              </Form.Group>
            </Col>
          </Row>
          <div className="mt-3">
            <Button variant="primary" type="submit">
              { loading ? "Creating Order...": "Create Order"}
            </Button>
            <span style={{margin: "15px"}}>Rs. {amount}</span>
            <PayPalButton 
            amount={ amount } 
            onSuccess = {successPaymentHandler}
            />
            
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};
