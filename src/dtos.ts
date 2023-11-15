export type row = {
    attribute: string,
    type: dto_type,
    text: string,
    altTable?: string
    mainRow?: string
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
    bool,
    select,
}

const name_attribute = "Название";

export const create_dtos: dtos_type = {
    "films": {
        name: "Фильмы",
        data: [
            {
                attribute: "name",
                "type": dto_type.string,
                "text": "Название",
            },
            {
                attribute: "description",
                type: dto_type.string,
                text: "Описание"
            },
            {
                attribute: "photo",
                type: dto_type.string,
                text: "Ссылка на фото"
            },
            {
                attribute: "creationYear",
                type: dto_type.number,
                text: "Год выпуска"
            },
            {
                attribute: "duration",
                type: dto_type.number,
                text: "Длительность"
            },
            {
                attribute: "directorId",
                type: dto_type.select,
                altTable: "directors",
                text: "Фамилия режиссера",
                mainRow: "Фамилия",
            },
            {
                attribute: "qualityId",
                type: dto_type.select,
                altTable: "qualities",
                text: "Качество",
                mainRow: "Название",
            },
            {
                attribute: "studioId",
                type: dto_type.select,
                altTable: "studios",
                text: "Название студии",
                mainRow: "Название",
            }
        ]
    },
    "cinemas": {
        name: "Кинотеатры",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название"},
            {attribute: "address", type: dto_type.string, text: "Адрес"},
            {attribute: "phone", type: dto_type.string, text: "Номер телефона"},
            {attribute: "license", type: dto_type.string, text: "Номер лицензии"},
            {attribute: "licenseEnd", type: dto_type.string, text: "Дата окончания лицензии"},
            {attribute: "seats", type: dto_type.number, text: "Кол-во сидений"},
            {attribute: "online", type: dto_type.bool, text: "Возможно покупки онлайн"},
            {
                attribute: "typeId",
                type: dto_type.select,
                mainRow: "Название",
                altTable: "cinema_types",
                text: "Тип"
            },
            {attribute: "districtId", type: dto_type.select, mainRow: "Название", altTable: "districts", text: "Район"},
        ]
    },
    "sessions": {
        name: "Сеансы",
        data: [
            {attribute: "date", type: dto_type.string, text: "Дата сеанса"},
            {attribute: "ticketsSold", type: dto_type.number, text: "Проданные билеты"},
            {attribute: "ticketsOnline", type: dto_type.number, text: "Проданные билеты онлайн"},
            {attribute: "price", type: dto_type.number, text: "Стоимость"},
            {
                attribute: "filmId",
                type: dto_type.select,
                mainRow: "Название",
                altTable: "films",
                text: "Название фильма"
            },
            {
                attribute: "cinemaId",
                type: dto_type.select,
                mainRow: "Название",
                altTable: "cinemas",
                text: "Название кинотеатра"
            },
            {
                attribute: "typeId",
                type: dto_type.select,
                mainRow: "Название",
                altTable: "session_types",
                text: "Тип"
            },
        ]
    },
    "directors": {
        name: "Режиссеры",
        data: [
            {attribute: "firstName", type: dto_type.string, text: "Имя"},
            {attribute: "lastName", type: dto_type.string, text: "Фамилия"},
        ]
    },
    "qualities": {
        name: "Качества пленки",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название"}
        ]
    },
    "studios": {
        name: "Студии",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название"},
            {attribute: "creationYear", type: dto_type.number, text: "Год основания"},
            {
                attribute: "countryId",
                type: dto_type.select,
                altTable: "countries",
                mainRow: "Название",
                text: "Страна основания"
            },
        ]
    },
    "session_types": {
        name: "Типы сеансов",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название"},
            {attribute: "ration", type: dto_type.number, text: "Коэффициент"},
        ]
    },
    "cinema_types": {
        name: "Типы собственности",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название"}
        ]
    },
    "districts": {
        name: "Районы",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название"}
        ]
    },
    "countries": {
        name: "Страны",
        data: [
            {attribute: "name", type: dto_type.string, text: "Название"}
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

export type Requests = IRequest[]

export const requests: Requests = [
    {
        name: "Симметричное внутренее соединение с условием по внешнему ключу(1)",
        altName: "Получить название фильмов выпущенные студией с заданным названием",
        path: "films/symmetricForeignFirst",
        withField: true,
        fieldName: "Название студии"
    },
    {
        name: "Симметричное внутренее соединение с условием по внешнему ключу(2)",
        altName: "Получить контакты кинотеатров в районе с заданым названием",
        path: "films/symmetricForeignSecond",
        withField: true,
        fieldName: "Название района"
    },
    {
        name: "Симметричное внутренее соединение с условием по дате(1)",
        altName: "Получить фильм, кинотеатр где он будет показываться и дату сеанса когда он будет показываться",
        path: "studios/symmetricDateFirst",
        withField: true,
        fieldName: "Дата (через пробел)"
    },
    {
        name: "Симметричное внутренее соединение с условием по дате(2)",
        altName: "Получить информацию о кинотеатрах у которых действительная лицензия (после указанной даты)",
        path: "cinemas/symmetricDateSecond",
        withField: true,
        fieldName: "Дата"
    },
    {
        name: "Симметричное внутреннее соединение без условия (1)",
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
        altName: "Получить название фильма и инициалы режиссера",
        path: "films/requestOnRequestLeft",
        withField: false,
    },
    {
        name: "Итоговый запрос без условия",
        altName: "Получить общее количество фильмов сгруппированных по году выпуска",
        path: "films/getAllCount",
        withField: false,
    },
    {
        name: "Итоговый запрос без условия c итоговыми данными вида: «всего», «в том числе»",
        altName: "Получить общее количество фильмов, в том числе длиннее часа и созданные после 2012 сгруппированных по качеству пленки",
        path: "films/finalRequestWithInclude",
        withField: false,
        withChart: true,
    },
    {
        name: "Итоговый запрос с условием на данные по значению",
        altName: "Получить отношение длительности фильма и количества фильмов с такой длительностью (больше заданной)",
        path: "films/finalBySpecificValue",
        withField: true,
        fieldName: "Длительность"
    },
    {
        name: "Итоговый запрос с условием на данные по маске",
        altName: "Получить количество фильмов имя которых соответствует заданной маске сгрупированных по режиссеру",
        path: "films/finalBySpecificMask",
        withField: true,
        fieldName: "Маска"
    },
    {
        name: "Итоговый запрос с условием на данные с использованием индекса",
        altName: "Получить по фамилии режиссера количество его фильмов",
        path: "films/finalByIndex",
        withField: true,
        fieldName: "Фамилия режиссера"
    },
    {
        name: "Итоговый запрос с условием на данные без использования индекса",
        altName: "Получить год создания фильмов и количество фильмов снятых в этом году",
        path: "films/finalWithoutIndex",
        withField: true,
        fieldName: "Год"
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
        altName: "Получить объединенные фильмы и кинотеатры",
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
        fieldName: "ID режиссера"
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