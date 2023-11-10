type row = {
    attribute: string,
    type: dto_type,
    text: string,
}

interface dtos_type {
    [key: string]: {
        name: string,
        data: row[]
    }
}

export enum dto_type {
    string,
    number,
    bool
}

export const create_dtos: dtos_type = {
    "films": {
        name: "Фильмы",
        data: [
            {
                attribute: "name",
                "type": dto_type.string,
                "text": "Имя фильма",
            },
            {
                attribute: "description",
                type: dto_type.string,
                text: "Описание фильма"
            },
            {
                attribute: "photo",
                type: dto_type.string,
                text: "Ссылка на фото"
            },
            {
                attribute: "creationYear",
                type: dto_type.number,
                text: "Год создания фильма"
            },
            {
                attribute: "duration",
                type: dto_type.number,
                text: "Длительность фильма"
            },
            {
                attribute: "directorId",
                type: dto_type.number,
                text: "Идентификатор режиссера"
            },
            {
                attribute: "qualityId",
                type: dto_type.number,
                text: "Идентификатор качества пленки"
            },
            {
                attribute: "studioId",
                type: dto_type.number,
                text: "Идентификатор студии"
            }
        ]
    },
    "cinemas": {
        name: "Кинотеатры",
        data: [
            {attribute: "name", type: dto_type.string, text: "Имя кинотеатра"},
            {attribute: "address", type: dto_type.string, text: "Адресс кинотеатра"},
            {attribute: "phone", type: dto_type.string, text: "Телефон кинотеатра"},
            {attribute: "license", type: dto_type.string, text: "Лицензии кинотеатра"},
            {attribute: "licenseEnd", type: dto_type.string, text: "Дата окончания лицензии"},
            {attribute: "seats", type: dto_type.number, text: "Количество мест"},
            {attribute: "online", type: dto_type.bool, text: "Возможность покупки онлайн"},
            {attribute: "typeId", type: dto_type.number, text: "Идентификатор типа собственности"},
            {attribute: "districtId", type: dto_type.number, text: "Идентификатор района"},
        ]
    },
    "sessions": {
        name: "Сеансы",
        data: [
            {attribute: "date", type: dto_type.string, text: "Дата сеанса"},
            {attribute: "ticketsSold", type: dto_type.number, text: "Количество проданных билетов"},
            {attribute: "ticketsOnline", type: dto_type.number, text: "Количество заказаных билетов через интернет"},
            {attribute: "price", type: dto_type.number, text: "Цена билета"},
            {attribute: "filmId", type: dto_type.number, text: "Идентификатор фильма"},
            {attribute: "cinemaId", type: dto_type.number, text: "Идентификатор кинотеатра"},
            {attribute: "typeId", type: dto_type.number, text: "Идентификатор типа сеанса"},
        ]
    },
    "directors": {
        name: "Режиссеры",
        data: [
            {attribute: "firstName", type: dto_type.string, text: "Имя режиссера"},
            {attribute: "lastName", type: dto_type.string, text: "Фамилия режиссера"},
        ]
    },
    "qualities": {
        name: "Качества пленки",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название качества"}
        ]
    },
    "studios": {
        name: "Студии",
        data: [
            {attribute: "name", type: dto_type.string, text: "Названии студии"},
            {attribute: "creationYear", type: dto_type.number, text: "Год создания студии"},
            {attribute: "countryId", type: dto_type.number, text: "Идентификатор страны размещения студии"},
        ]
    },
    "session_types": {
        name: "Типы сеансов",
        data: [
            {attribute: "name", type: dto_type.string, text: "Названии типа сеанса"},
            {attribute: "ration", type: dto_type.number, text: "Коэффициент"},
        ]
    },
    "cinema_types": {
        name: "Типы собственности",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название типа собственности"}
        ]
    },
    "districts": {
        name: "Районы",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название района"}
        ]
    },
    "countries": {
        name: "Страны",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название страны"}
        ]
    }
}

export interface IRequest {
    name: string
    altName?: string
    path: string
    withField: boolean
    fieldName?: string
    withChart?: boolean
}

// export interface Requests {
//     [key: number]: IRequest
// }

export type Requests = IRequest[]

export const requests: Requests = [
    {
        name: "Симметричное внутренее соединение с условием (1)",
        altName: "Получить название фильмов выпущенные студией с заданым ID",
        path: "films/symmetricForeignFirst",
        withField: true,
        fieldName: "ID студии"
    },
    {
        name: "Симметричное внутренее соединение с условием (3)",
        path: "studios/symmetricDateFirst",
        withField: true,
        fieldName: "Начальная дата"
    },
    {
        name: "Симметричное внутренее соединение без условия (1)",
        altName: "Получить дату сеансов и их тип",
        path: "films/symmetricWithoutCondFirst",
        withField: false,
    },
    {
        name: "Симметричное внутренее соединение без условия (2)",
        altName: "Получить дату сеанса и название фильма",
        path: "sessions/symmetricWithoutCondSecond",
        withField: false,
    },
    {
        name: "Симметричное внутренее соединение без условия (3)",
        altName: "Получить название студий и страну их размещения",
        path: "studios/symmetricWithoutCondThird",
        withField: false,
    },
    {
        name: "Правое внешнее соединение",
        altName: "Получить название фильмов и их кинотеатров",
        path: "studios/rightOuter",
        withField: false,
    },
    {
        name: "Запрос на запросе по принципу левого соединения",
        altName: "Получить имя фильма и инициалы режиссера",
        path: "films/requestOnRequestLeft",
        withField: false,
    },
    {
        name: "Итоговый запрос без условия",
        altName: "Получить общее количество фильмов",
        path: "films/getAllCount",
        withField: false,
    },
    {
        name: "Итоговый запрос без условия c итоговыми данными вида: «всего», «в том числе»",
        altName: "Получить общее количество фильмов, в том числе длинее часа и созданные после 2012",
        path: "films/finalRequestWithInclude",
        withField: false,
        withChart: true,
    },
    {
        name: "Итоговый запрос с условием на группы",
        altName: "Получить список типов кинотеатров и количества сеансов для каждого типа (где цена билета превышает N количество)",
        path: "cinemas/finalRequestWithGroups",
        withField: true,
        fieldName: "Цена билета"
    },
    {
        name: "Итоговый запрос с условием на данные и на группы",
        altName: "Получить количество фильмов (вышедших после указаного года) для каждого качества пленки",
        path: "qualities/finalRequestGroupsData",
        withField: true,
        fieldName: "Год"
    },
    {
        name: "Запрос на запросе по принципу итогового запроса",
        altName: "Получить инициалы режиссера и общее количество его фильмов",
        path: "directors/requestOnRequestFinal",
        withField: false,
    },
    {
        name: "Запрос с использованием объединения",
        altName: "Получить объедененные фильмы и кинотеатры",
        path: "districts/requestWithUnion",
        withField: false,
    },
    {
        name: "Запросы с подзапросами (in)",
        altName: "Получить название фильмов которые были сняты студиями, созданными после 2010 года",
        path: "films/requestWithIn",
        withField: false,
    },
    {
        name: "Запросы с подзапросами (not in)",
        altName: "Получить название районов в которых отсутствуют кинотеатры",
        path: "districts/requestWithNotIn",
        withField: false,
    },
    {
        name: "Запросы с подзапросами (case)",
        altName: "Получить классификацию фильмов",
        path: "films/requestWithCase",
        withField: false,
    },
    {
        name: "Запросы с подзапросами (операция над итог. данными)",
        altName: "Получить общее количество фильмов снятых режиссером",
        path: "films/requestWithFinalData",
        withField: true,
        fieldName: "Имя режиссера"
    },
    {
        name: "Определить среднее количество зрителей по каждому кинотеатру",
        altName: "Определить среднее количество зрителей по каждому кинотеатру",
        path: "cinemas/generateAverageNumberOfViewersForEachCinema",
        withField: false,
    },
    {
        name: "Определить среднее количество зрителей по кинотеатрам каждого района",
        altName: "Определить среднее количество зрителей по кинотеатрам каждого района",
        path: "cinemas/generateAverageNumberOfViewersForAllCinemasInEachDist",
        withField: false,
    },
    {
        name: "Определить пять наиболее топовых фильмов для каждого кинотеатра",
        altName: "Определить пять наиболее топовых фильмов для каждого кинотеатра",
        path: "cinemas/getTopFilmsByCinema",
        withField: false,
    },
    {
        name: "Определить пять наиболее топовых фильмов по каждому району",
        altName: "Определить пять наиболее топовых фильмов по каждому району",
        path: "districts/getTopFilmsByDistrict",
        withField: false,
    },
    {
        name: "Определить суммарный доход и количество прокатов для каждого режиссера",
        altName: "Определить суммарный доход и количество прокатов для каждого режиссера",
        path: "directors/getTotalIncome",
        withField: true,
        fieldName: "Год"
    },
]