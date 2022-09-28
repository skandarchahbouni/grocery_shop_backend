class Address {
    constructor({address_line_1, address_line_2, city, id_country, zip_code, business_name}){
        this.address_line_1 = address_line_1
        this.address_line_2 = address_line_2
        this.city = city
        this.id_country = id_country
        this.zip_code = zip_code
        this.business_name = business_name
    }
}

module.exports = Address