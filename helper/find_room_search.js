const find_room_search = (data, index, customer, value, result) => {
    const list_room = data.room_empty;
    if(customer <= 0){
        result.push({
            hotel_name: data.hotel_name,
            rooms: [...value],
        });
        return;
    }

    const selectedRoom = new Set(value.map(room => room.room_detail_id));

    for (let i = index; i < list_room.length; i++) {
        if (!selectedRoom.has(list_room[i].room_detail_id) && list_room[i].adult_count <= customer) {
            value.push(list_room[i]);
            find_room_search(data, i + 1, customer - list_room[i].adult_count, value, result); 
            value.pop();
        }
    }
}

const find_room_hotel = (data, customer) =>{
    const result = [];
    for (let hotelData of data) {
        find_room_search(hotelData, 0, customer, [], result); 
    }
    return result;
}

const convert = (data) => {
    const groupedByHotel = data.reduce((acc, hotel) => {
        const hotelName = hotel.hotel_name.trim();
        if (!acc[hotelName]) {
            acc[hotelName] = [];
        }
        acc[hotelName] = acc[hotelName].concat(hotel.rooms);
        return acc;
    }, {});

    const result = Object.entries(groupedByHotel).map(([hotelName, rooms]) => {
        const groupedRooms = rooms.reduce((acc, room) => {
            const key = `${room.room_id}-${room.room_name}-${room.adult_count}-${room.total_price}`;
            if (!acc[key]) {
                acc[key] = {
                    room_id: room.room_id,
                    room_name: room.room_name,
                    adult_count: room.adult_count,
                    total_price: room.total_price,
                    count: 0,
                };
            }
            acc[key].count += 1;
            return acc;
        }, {});

        const suggestions = Object.values(groupedRooms).reduce((acc, room, index) => {
            const suggestKey = `suggest_${String(index + 1).padStart(2, '0')}`;
            acc[suggestKey] = acc[suggestKey] || [];
            acc[suggestKey].push(room);
            return acc;
        }, {});

        return {
            hotel_name: hotelName,
            ...suggestions,
        };
    });

    return result;
}
module.exports = {find_room_hotel, convert};