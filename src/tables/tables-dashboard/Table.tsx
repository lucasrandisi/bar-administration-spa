import React, { useEffect } from "react";
import styled from "styled-components";
import moment from "moment";
import { Link } from "react-router-dom";
import { TableInterface } from "../models/table.model";
import ListAlt from '@material-ui/icons/ListAlt';
import EventBusy from '@material-ui/icons/EventBusy';
import Add from '@material-ui/icons/Add';
import maderaCeleste from "../table-imgs/madera-celeste.jpg";
import maderaAmarilla from "../table-imgs/madera-amarilla.jpg";
import maderaVerde from "../table-imgs/madera-verde.jpg";

export default function Table(props) {
	const { table }: { table: TableInterface } = props;
	let timer: string = "";

	useEffect(() => {
		const dateTimer = setTimeout(() => null, 1000 * 60);

		return () => clearTimeout(dateTimer);
	});
	
    if (table.nextReservation) {
		const reservationTime = moment(table.nextReservation.reservationDateTime);
		timer = `${reservationTime.format('HH:mm')}`;
	}

	const hasOrder = table.currentOrder;
	const hasBooking = table.nextReservation && !table.nextReservation.cancelationDateTime;
	const hasAny = !hasBooking && !hasOrder
	const reservedTime = moment(table.nextReservation?.reservationDateTime).format('HH:mm');

	return (
        <TableLink to={`table/${table.id}/${table.nextReservation ? table.nextReservation.id : 'new'}`}>
            <div className="container">
                <div className="table-container table-container-left"
                >{table.id}</div>
                <StateIconTable table={table} className="table-container table-container-icon">
                    {hasOrder && <ListAlt />}
                    {hasBooking  && !hasOrder && <EventBusy />}				
                    {hasAny && <Add />}
                    
                </StateIconTable>
                <div className="table-container table-container-time">
                    {hasBooking && !hasOrder && <StyleP>Booking at <br></br> {timer} hrs</StyleP>}
                    {hasAny && <StyleP className="available">Available</StyleP>}		
                </div>
                
                <StateTable table={table} className="table-container table-container-right">
                    {hasBooking && hasOrder && 
                        <p className="next-reservation">
                            Have a reservation soon at {reservedTime} hs
                        </p>
                    }
                </StateTable>
            </div>
		</TableLink>
	);
} 

const StyleP = styled.p`
	font-family: 'Poppins';
	font-size: 13px;
`
const StateTable = styled.div`
	background-color: ${props => {
		if (props.table.currentOrder) {
			return props.theme.with_order;
		}
		if (props.table.nextReservation) {
			return props.theme.with_reservation;
		}
		return props.theme.available;
	}};
`;

const StateIconTable = styled.div`
	background-image: ${props => {
		if (props.table.currentOrder) {
			return `url(${maderaCeleste})`;
		}
		if (props.table.nextReservation && !props.table.nextReservation.cancelationDateTime) {
			return `url(${maderaAmarilla})`;
		}
		return `url(${maderaVerde})`;
	}};
`;

const TableLink = styled(Link)`
	text-decoration: none;
	&:hover {
		color: green;
		cursor: pointer;
	}
	color: black;
`;