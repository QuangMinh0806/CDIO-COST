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

const convert= (hotels) =>{
    const convertedHotels = hotels.map(hotel => {
        const roomGroups = {};
    
        hotel.rooms.forEach(room => {
            const key = `option_${room.room_id}`;
            if (!roomGroups[key]) {
                roomGroups[key] = [];
            }
    
            const existingRoom = roomGroups[key].find(r => r.room_name === room.room_name);
            if (existingRoom) {
                existingRoom.count++;
            } else {
                roomGroups[key].push({
                    room_id: room.room_id,
                    room_name: room.room_name,
                    adult_count: room.adult_count,
                    total_price: room.total_price,
                    count: 1
                });
            }
        });
    
        return {
            hotel_name: hotel.hotel_name,
            rooms: roomGroups
        };
    });
    
}

function filterHotelsByPrice(hotels, start, end) {
    return hotels.map(hotel => {
        const filteredRooms = {};

        for (const [option, rooms] of Object.entries(hotel.rooms)) {
            const filtered = rooms.filter(room => {
                const totalCost = room.total_price * room.count;
                return totalCost >= start && totalCost <= end;
            });

            if (filtered.length > 0) {
                filteredRooms[option] = filtered;
            }
        }

        return {
            hotel_name: hotel.hotel_name,
            rooms: filteredRooms
        };
    }).filter(hotel => Object.keys(hotel.rooms).length > 0);
}
module.exports = {find_room_hotel};