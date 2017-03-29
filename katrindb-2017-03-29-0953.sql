--
-- PostgreSQL database dump
--

-- Dumped from database version 9.6.2
-- Dumped by pg_dump version 9.6.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: katrin
--

CREATE TABLE feedbacks (
    id integer NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL,
    name character varying(50) DEFAULT NULL::character varying,
    email character varying(50) DEFAULT NULL::character varying,
    tel character varying(50) DEFAULT NULL::character varying,
    title character varying(50) DEFAULT NULL::character varying,
    message character varying(5000) NOT NULL,
    approved boolean DEFAULT false NOT NULL
);


ALTER TABLE feedbacks OWNER TO katrin;

--
-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: katrin
--

CREATE SEQUENCE feedbacks_id_seq
    START WITH 11
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE feedbacks_id_seq OWNER TO katrin;

--
-- Name: feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: katrin
--

ALTER SEQUENCE feedbacks_id_seq OWNED BY feedbacks.id;


--
-- Name: gallery; Type: TABLE; Schema: public; Owner: katrin
--

CREATE TABLE gallery (
    id integer NOT NULL,
    masterid integer NOT NULL,
    filename character varying(50) NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE gallery OWNER TO katrin;

--
-- Name: gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: katrin
--

CREATE SEQUENCE gallery_id_seq
    START WITH 30
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gallery_id_seq OWNER TO katrin;

--
-- Name: gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: katrin
--

ALTER SEQUENCE gallery_id_seq OWNED BY gallery.id;


--
-- Name: goods_list; Type: TABLE; Schema: public; Owner: katrin
--

CREATE TABLE goods_list (
    id integer NOT NULL,
    type integer NOT NULL,
    name character varying(500) NOT NULL,
    description character varying(1000),
    price character varying(10) NOT NULL,
    bulk integer,
    photo character varying(50)
);


ALTER TABLE goods_list OWNER TO katrin;

--
-- Name: goods_list_id_seq; Type: SEQUENCE; Schema: public; Owner: katrin
--

CREATE SEQUENCE goods_list_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE goods_list_id_seq OWNER TO katrin;

--
-- Name: goods_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: katrin
--

ALTER SEQUENCE goods_list_id_seq OWNED BY goods_list.id;


--
-- Name: goods_types; Type: TABLE; Schema: public; Owner: katrin
--

CREATE TABLE goods_types (
    id integer NOT NULL,
    name character varying(50)
);


ALTER TABLE goods_types OWNER TO katrin;

--
-- Name: goods_types_id_seq; Type: SEQUENCE; Schema: public; Owner: katrin
--

CREATE SEQUENCE goods_types_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE goods_types_id_seq OWNER TO katrin;

--
-- Name: goods_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: katrin
--

ALTER SEQUENCE goods_types_id_seq OWNED BY goods_types.id;


--
-- Name: masters; Type: TABLE; Schema: public; Owner: katrin
--

CREATE TABLE masters (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    title character varying(50) NOT NULL,
    email character varying(50) DEFAULT NULL::character varying,
    notify boolean DEFAULT false,
    tel character varying(50) DEFAULT NULL::character varying,
    main_page boolean DEFAULT false NOT NULL,
    photo character varying(50)
);


ALTER TABLE masters OWNER TO katrin;

--
-- Name: masters_id_seq; Type: SEQUENCE; Schema: public; Owner: katrin
--

CREATE SEQUENCE masters_id_seq
    START WITH 15
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE masters_id_seq OWNER TO katrin;

--
-- Name: masters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: katrin
--

ALTER SEQUENCE masters_id_seq OWNED BY masters.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: katrin
--

CREATE TABLE questions (
    id integer NOT NULL,
    ts timestamp without time zone DEFAULT now() NOT NULL,
    name character varying(50) DEFAULT NULL::character varying,
    email character varying(50) DEFAULT NULL::character varying,
    tel character varying(50) DEFAULT NULL::character varying,
    message character varying(5000) DEFAULT NULL::character varying,
    answered boolean DEFAULT false
);


ALTER TABLE questions OWNER TO katrin;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: katrin
--

CREATE SEQUENCE questions_id_seq
    START WITH 3
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE questions_id_seq OWNER TO katrin;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: katrin
--

ALTER SEQUENCE questions_id_seq OWNED BY questions.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: katrin
--

CREATE TABLE requests (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    email character varying(50) DEFAULT NULL::character varying,
    tel character varying(50) NOT NULL,
    message character varying(5000) DEFAULT NULL::character varying,
    serviceid integer NOT NULL,
    selecteddate timestamp without time zone,
    regdate timestamp without time zone DEFAULT now() NOT NULL,
    completed boolean DEFAULT false
);


ALTER TABLE requests OWNER TO katrin;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: katrin
--

CREATE SEQUENCE requests_id_seq
    START WITH 36
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE requests_id_seq OWNER TO katrin;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: katrin
--

ALTER SEQUENCE requests_id_seq OWNED BY requests.id;


--
-- Name: service_list; Type: TABLE; Schema: public; Owner: katrin
--

CREATE TABLE service_list (
    id integer NOT NULL,
    type integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(1000) NOT NULL,
    duration integer,
    price character varying(10) NOT NULL
);


ALTER TABLE service_list OWNER TO katrin;

--
-- Name: service_list_id_seq; Type: SEQUENCE; Schema: public; Owner: katrin
--

CREATE SEQUENCE service_list_id_seq
    START WITH 27
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE service_list_id_seq OWNER TO katrin;

--
-- Name: service_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: katrin
--

ALTER SEQUENCE service_list_id_seq OWNED BY service_list.id;


--
-- Name: service_type; Type: TABLE; Schema: public; Owner: katrin
--

CREATE TABLE service_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE service_type OWNER TO katrin;

--
-- Name: service_type_id_seq; Type: SEQUENCE; Schema: public; Owner: katrin
--

CREATE SEQUENCE service_type_id_seq
    START WITH 5
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE service_type_id_seq OWNER TO katrin;

--
-- Name: service_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: katrin
--

ALTER SEQUENCE service_type_id_seq OWNED BY service_type.id;


--
-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY feedbacks ALTER COLUMN id SET DEFAULT nextval('feedbacks_id_seq'::regclass);


--
-- Name: gallery id; Type: DEFAULT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY gallery ALTER COLUMN id SET DEFAULT nextval('gallery_id_seq'::regclass);


--
-- Name: goods_list id; Type: DEFAULT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY goods_list ALTER COLUMN id SET DEFAULT nextval('goods_list_id_seq'::regclass);


--
-- Name: goods_types id; Type: DEFAULT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY goods_types ALTER COLUMN id SET DEFAULT nextval('goods_types_id_seq'::regclass);


--
-- Name: masters id; Type: DEFAULT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY masters ALTER COLUMN id SET DEFAULT nextval('masters_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY questions ALTER COLUMN id SET DEFAULT nextval('questions_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY requests ALTER COLUMN id SET DEFAULT nextval('requests_id_seq'::regclass);


--
-- Name: service_list id; Type: DEFAULT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY service_list ALTER COLUMN id SET DEFAULT nextval('service_list_id_seq'::regclass);


--
-- Name: service_type id; Type: DEFAULT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY service_type ALTER COLUMN id SET DEFAULT nextval('service_type_id_seq'::regclass);


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: katrin
--

COPY feedbacks (id, ts, name, email, tel, title, message, approved) FROM stdin;
10	2017-03-22 07:12:34	Михаил	\N	\N	Ольга	Ольга права	t
9	2017-03-22 07:12:18	Алексей	\N	\N	Ок	Все отлично	t
5	2017-03-22 04:25:52	Елена Иванова	\N	\N	\N	Хочу отметить, что все инструменты были обработаны перед процедурой прямо при мне  так что не было причин для волнения. Работа мастера выполнена очень аккуратно  я очень довольна новой стрижкой.	t
4	2017-03-22 04:25:38	Анна Петрова	\N	\N	\N	Очень порадовал сервис, процедура по наращивание ресниц проведена достаточно быстро и безболезненно. Всем советую мастера.	t
3	2017-03-22 04:25:23	Ольга Смирнова	\N	\N	\N	В салоне представлено максимально приятное сочетание качества услуг и цен. Все процедуры выполнены качественно, чувствуется рука мастера. Приду к вам снова	t
1	2017-03-21 06:50:10	Ольга	olga@mail.ru	нет	Отзыв	Всё хорошо	f
\.


--
-- Name: feedbacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: katrin
--

SELECT pg_catalog.setval('feedbacks_id_seq', 11, true);


--
-- Data for Name: gallery; Type: TABLE DATA; Schema: public; Owner: katrin
--

COPY gallery (id, masterid, filename, created) FROM stdin;
1	8	8-1.jpg	2017-03-24 11:02:04
2	8	8-2.jpg	2017-03-24 11:02:04
3	8	8-3.jpg	2017-03-24 11:02:04
4	8	8-4.jpg	2017-03-24 11:02:04
5	8	8-5.jpg	2017-03-24 11:02:04
6	9	9-6.jpg	2017-03-24 11:02:04
7	9	9-7.jpg	2017-03-24 11:02:04
8	9	9-8.jpg	2017-03-24 11:02:04
9	9	9-9.jpg	2017-03-24 11:02:04
10	9	9-10.jpg	2017-03-24 11:02:04
11	10	10-11.jpg	2017-03-24 11:02:04
12	10	10-12.jpg	2017-03-24 11:02:04
13	10	10-13.jpg	2017-03-24 11:02:04
14	10	10-14.jpg	2017-03-24 11:02:04
15	10	10-15.jpg	2017-03-24 11:02:04
16	11	11-16.jpg	2017-03-24 11:02:04
17	11	11-17.jpg	2017-03-24 11:02:04
18	11	11-18.jpg	2017-03-24 11:02:04
19	11	11-19.jpg	2017-03-24 11:02:04
20	11	11-20.jpg	2017-03-24 11:02:04
21	13	13-21.jpg	2017-03-24 11:02:04
22	13	13-22.jpg	2017-03-24 11:02:04
23	13	13-23.jpg	2017-03-24 11:02:04
24	13	13-24.jpg	2017-03-24 11:02:04
25	13	13-25.jpg	2017-03-24 11:02:04
29	12	12-1490553266895.jpeg	2017-03-26 22:34:26.896437
\.


--
-- Name: gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: katrin
--

SELECT pg_catalog.setval('gallery_id_seq', 29, true);


--
-- Data for Name: goods_list; Type: TABLE DATA; Schema: public; Owner: katrin
--

COPY goods_list (id, type, name, description, price, bulk, photo) FROM stdin;
6	1	Восстанавливающий шампунь для волос	Восстанавливающий шампунь благоприятно воздействует на структуру поврежденных или окрашенных волос, возвращая им эластичность, влагу и здоровый внешний вид. Обеспечивает глубокое восстановление и питание сухих, ломких, ослабленных и поврежденных волос. Возвращает волосам вещества, утерянные в процессе химических и термических обработок. Для всех типов волос.\n	530	250	6.jpeg
7	1	Восстанавливающее масло для поврежденных волос	Восстанавливающее масло от Constant Delight предназначено для глубокого восстановления поврежденных волос. Мгновенный эффект за 60 секунд. Заметный результат после первого применения. Кератиновый комплекс в составе масла заполняет поврежденные участки ломких волос, выравнивая чешуйчатый слой волоса. Минеральное масло обеспечивает гладкость и шелковистость непослушных волос\n	910	100	7.jpeg
4	1	Бальзам  с маслом арганы и лецитином	Бальзам Constant Delight Balsamo Uso Quotidiano E Nutrimento помогает обеспечить локонам любого типа полноценное питание, увлажнение и кондиционирование. Густой и обладающий приятным ароматом, он убирает жесткость и хрупкость волос, разглаживает и насыщает всеми необходимыми питательными веществами, позволяет навсегда забыть о непослушности прядей во время расчесывания или укладки.\n	310	250	4.jpeg
5	1	Шампунь для придания объема	Придает дополнительный объем и форму даже самым тонким волосам.  Увлажняет и питает волосы. Подходит для ежедневного использования. Шампунь для придания объема Constant Delight shampoo volume per rado содержит в своем составе натуральный экстракт багряных водорослей и протеин, предупреждающие ломкость и выпадение волос. Придает дополнительный блеск волосам.\n	270	250	5.jpeg
1	1	Шампунь с маслом арганы и лецитином	Ежедневный шампунь Constant Delight Shampoo Uso Quotidiano E Nutrimento – это профессиональное очищение для волос любого типа. Достаточно густой по консистенции и обладающий легким ароматом, попадая на пряди, он образует мягкую воздушную пену, которая снимает все загрязнения, при этом не обезвоживает.\n	310	250	1.jpeg
2	1	Сыворотка  с маслом арганы и лецитином	Несмываемая крем-сыворотка Constant Delight Siero Uso Quotidiano E Nutrimento отличается удивительно легкой текстурой, мягко окутывает каждую прядь тончайшим слоем из органических питательных компонентов, помогает не только улучшить качество волос, но и уберечь их от повседневных нагрузок.\n	485	250	2.jpeg
3	1	Маска  с маслом арганы и лецитином	Обеспечить локонам интенсивное питание и заботу на каждый день помогает специальная маска Constant Delight Maschera Uso Quotidiano E Nutrimento. Благодаря высокой концентрации натуральных компонентов продукт прекрасно оживляет волосы, наполняет их силой, сиянием и гладкостью, за счет специального кондиционирующего комплекса – значительно упрощает стайлинг и расчесывание.\n	320	250	3.jpeg
8	1	Восстанавливающее масло-спрей живительная сила	Масло с интенсивным восстанавливающим действием. Благодаря восстанавливающему маслу даже тонкие и хрупкие из-за химических процедур или из-за агрессивных внешних воздействий волосы приобретут вновь жизненные силы и здоровый внешний вид.\n	945	200	8.jpeg
16	3	Кератин шампунь Kapous Magic Keratin Shampoo	Уникальное сочетание бережного очищения и глубокого восстановления, идеально подходящие для травмированных температурно или химически, ослабленных и истонченных, а также зрелых волос. Продукт мягко убирает с кожи и локонов все загрязнения, за счет формулы без агрессивных сульфатов не вызывает раздражения, подходить для повседневного использования.\n	340	300	16.jpeg
17	3	Кератин бальзам Kapous Magic Keratin Balsam	Основным компонентом этого продукта выступает натуральный высококачественный кератин – белок, составляющий человеческий волос на 80%. Мельчайшие молекулы кератина с легкость проникают в самое сердце каждого волоска – кортекс, быстро убирают хрупкость и пористость волосяного стержня, приносят прядям эластичность и гладкость, решают проблему сечения кончиков.\n	340	250	17.png
14	2	Шампунь-витамин салонный для частого применения	Идеальный, насыщенный витаминами салонный продукт для ухода за нормальными - окрашенными или натуральными волосами. Подходит для всех типов волос. Отлично поддерживает структуру волос в оптимальном тонусе, увлажняя и питая их в течении всего дня. Надежно защищает волосы от воздействий термических укладок или химических препаратов. Шампунь бережно смывает с волос любые стайлинговые средства, одновременно придавая волосам здоровый блеск, мягкость и эластичность. В состав шампуня включено максимальное количество натуральных компонентов, минимизированы сульфаты, что оказывает мягкое воздействие на структуру волос и кожу головы.\n	140	200	14.jpeg
13	2	Шампунь-архитектор волос для восстановления и питания	Шампунь для интенсивного мгновенного восстановления - идеально подходит для пористых, повреждённых, натуральных или осветлённых и обесцвеченных волос. Особенно эффективен для сухих и ослабленных волос. Мягко очищает и подходит для ежедневного применения. Шампунь бережно очищает волосы, обеспечивая максимальный уход и восстановление поврежденной структуры. Благодаря входящим в состав эссенции шишек кипариса и кератину конского жира интенсивно питает, восстанавливает и защищает поврежденные волосы, насыщает их активными компонентами, придавая жизненную силу и тонус.\n	140	200	13.jpeg
18	3	Реструктурирующая сыворотка с кератином Kapous Magic Keratin Serum	Регенерирующая сыворотка Magic Keratin создана для ухода за травмированными неоднократным окрашиванием и сухими локонами. В этом продукте специалисты бренда Kapous Professional соединили уникальные способности кератина и молочных кислот, и направили их на глубокую реконструкцию и увлажнение ослабленных химически прядей.\n	370	200	18.jpeg
19	3	Реструктурирующая маска с кератином Kapous Magic Keratin Mask	Травмированные окрашиванием или завивкой, сухие и ломкие пряди нуждаются в особенном питании и уходе, обеспечить которые позволяет применение специальной реструктурирующей маски Magic Keratin от Kapous Professional. Продукт обладает густой консистенцией, равномерно окутывает каждый локон коктейлем из высококачественного кератина и протеинов пшеницы, помогает профессионально решить основные проблемы ослабленных прядей.\n	460	500	19.jpeg
20	3	Шампунь с биотином для укрепления и стимуляции роста волос 	Шампунь Kapous Professional Biotin Energy – это гармоничное соединение прекрасных очищающих и ухаживающих качеств, направленное на укрепление и стимуляцию роста здоровых и красивых локонов. В основе продукта лежит формула Fragrance free (без отдушек и агрессивных сульфатов) гарантирующая максимально бережное воздействие на кожные покровы и волосы, а также не вызывающая раздражения или аллергических реакций.\n	450	250	20.jpeg
21	3	Маска с биотином для укрепления и стимуляции роста волос 	Обеспечить одновременный уход и волосам и коже головы позволяет уникальная маска Biotin Energy от Капус. Этот продукт сочетает в себе лучшие компоненты, направленные на оздоровление кожных покровов и быструю реконструкцию ослабленных локонов, и уже после недельного использования делает пряди сильными и более густыми, мягкими и блестящими.\n	470	250	21.jpeg
22	3	Лосьон с биотином для укрепления и стимуляции роста волос 	Лосьон Kapous Professional Biotin Energy позволяет укрепить волосы и значительно ускорить их рост. Сочетание биотина и уникального биокомплекса GP4G (Artemia Extract) благотворно влияет на состояние кожных покровов головы, отлично оздоравливает и омолаживает клетки эпидермиса, что положительно сказывается на состоянии локонов в целом\n	410	100	22.jpeg
11	2	Шампунь укрепляющий для иммунной стимуляции роста волос	Натуральные лечебные экстракты интенсивно питают волосы, предупреждая их выпадение, активизируют рост. Восстанавливают структуру волос после окрашивания и химической завивки. Повышают и стабилизируют иммунную систему кожного и волосяного покрова, противостоят вредному воздействию окружающей среды, УФ-излучению и стрессу. Устраняют перхоть. Делают волосы послушными в укладке, придают дополнительный объем.\n	140	200	11.jpeg
12	2	Крем-шампунь для вьющихся волос "Кудри ангела"	Шампунь для вьющихся волос бережно очищает волосы, делая их эластичными, пружинистыми, равномерными по длине и блестящими. Значительно уплотняет волос, создавая дополнительный объем и облегчая расчесывание. После использования шампуня волосы становятся более послушными и шелковистыми. Шампунь превосходно ухаживает как за натурально вьющимися, так и химически завитыми волосами. Придаёт неуправляемым волосам мягкость и гладкость. Аккуратно очищая волосы, шампунь оказывает при этом подпитку необходимыми витаминами и протеинами. Учитывая частую повышенную чувствительность к пересыханию кудрявых волос, шампунь снабжает волосы необходимы минералами, сохраняя влагу. Волосы начинают выглядеть более здоровыми и получают ослепительный блеск. \n	140	200	12.jpeg
15	2	Шампунь интенсивное увлажнение для волос. Аква-фитнес для волос	Активно увлажняющий шампунь для сухих, обезвоженных волос, которым не хватает эластичности и упругости. Часто при этом тонких и слабых. Достаточно эффективен как профилактика или дополнительный глубокий уход за нормальными, волнистыми или кудрявыми, жесткими или наоборот хрупкими волосами. Быстро нормализует гидробаланс - уровень влаги волос и кожи головы. Помогает разгладить поверхность волос, придать им гибкость, упругость и здоровый блеск. Наиболее важно: деликатно очищает и увлажняет сухие волосы. \n	140	200	15.jpeg
\.


--
-- Name: goods_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: katrin
--

SELECT pg_catalog.setval('goods_list_id_seq', 22, true);


--
-- Data for Name: goods_types; Type: TABLE DATA; Schema: public; Owner: katrin
--

COPY goods_types (id, name) FROM stdin;
1	Constant delight
2	Indigo
3	Kapous
\.


--
-- Name: goods_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: katrin
--

SELECT pg_catalog.setval('goods_types_id_seq', 3, true);


--
-- Data for Name: masters; Type: TABLE DATA; Schema: public; Owner: katrin
--

COPY masters (id, name, title, email, notify, tel, main_page, photo) FROM stdin;
9	Наталья Кодесникова	мастер ногтевого сервиса	nata@katrin.ru	f	541112	t	9.jpg
10	Александра Степанова	парикмахер	alexa@katrin.ru	f	541113	t	10.jpg
11	Ольга Якурнова	парикмахер	olya@katrin.ru	f		t	11.jpg
12	Мария Александрова	мастер по наращиванию волос	maria@katrin.ru	f		t	12.jpg
13	Александр Кашурников	тату мастер	alex@katrin.ru	t		f	13.jpg
14	Анна Мариасис	менеджер	anna@katrin.ru	t	541110	f	14.jpg
8	Ольга Кузнецова	мастер ногтевого сервиса	olga@katrin.ru	f	541111	t	8.jpeg
\.


--
-- Name: masters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: katrin
--

SELECT pg_catalog.setval('masters_id_seq', 15, true);


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: katrin
--

COPY questions (id, ts, name, email, tel, message, answered) FROM stdin;
2	2017-03-21 06:52:50	Катя	kat@mail.ru	\N	Парики есть?	t
1	2017-03-26 22:12:19.704577	asd	asd	asd	ad	t
\.


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: katrin
--

SELECT pg_catalog.setval('questions_id_seq', 3, true);


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: katrin
--

COPY requests (id, name, email, tel, message, serviceid, selecteddate, regdate, completed) FROM stdin;
35	sdfsdf	\N	3333	\N	7	2017-03-25 10:00:00	2017-03-24 10:07:58	f
13	Ddd	\N	1212	\N	13	2017-03-24 09:00:00	2017-03-24 05:40:06	t
\.


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: katrin
--

SELECT pg_catalog.setval('requests_id_seq', 36, true);


--
-- Data for Name: service_list; Type: TABLE DATA; Schema: public; Owner: katrin
--

COPY service_list (id, type, name, description, duration, price) FROM stdin;
5	2	Стрижка молодежная		60	200
6	2	Стрижка модельная 		60	250
7	2	Стрижка полубокс, бокс		60	200
12	3	Подравнивание волос		60	100
30	1	Подравнивание волос		30	100
31	1	Мытье головы 		15	100
32	1	Стрижка челки		30	70
41	1	Выпрямление утюжком		30	от 1450
42	1	Полировка волос		60	500
43	1	Вечерняя прическа		50	от 400
8	2	Стрижка спортивная 		90	180
9	2	Стрижка наголо		20	70
10	2	Окантовка		20	70
11	2	Мытье головы 		15	50
13	3	Стрижка		60	150
14	3	Стрижка челки		60	50
44	4	Стрижка наголо		30	50
45	4	Стрижка модельная; молодежная		40	200
46	4	Стрижка полубокс; бокс		30	150
47	4	Стрижка спортивная 		30	100
48	5	Классический, обрезной		30	200
49	5	Европейский		30	200
50	5	Коррекция гелем		40	500
51	5	Наращивание гелевое		30	600
52	5	Педикюр		60	800
53	6	Наращивание ресниц		40	800
54	6	Наращивание уголков ресниц		30	500
55	6	Коррекция поштучно		25	400
56	6	Снятие наращенных ресниц		15	200
57	6	Окрас бровей		15	100
58	6	Коррекция бровей		15	100
59	6	Окрас ресниц		15	100
60	6	Биотатуаж бровей		40	850
61	6	Прокалывание ушей		20	500
33	1	Укладка феном		15	от 200
34	1	Укладка феном		15	от 200
35	1	Укладка с элементами прически 		30	от 250
36	1	Завивка волос плойкой		30	от 200
37	1	Выпрямление утюжком		30	от 1450
38	1	Укладка феном		15	от 200
39	1	Укладка с элементами прически 		30	от 250
40	1	Завивка волос плойкой		30	от 200
1	1	Стрижка		90	от 250
2	1	Мелирование		120	от 350
3	1	Окрашивание волос		60	от 450
4	1	Химическая завивка 		120	от 300
\.


--
-- Name: service_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: katrin
--

SELECT pg_catalog.setval('service_list_id_seq', 61, true);


--
-- Data for Name: service_type; Type: TABLE DATA; Schema: public; Owner: katrin
--

COPY service_type (id, name) FROM stdin;
1	Женский зал
2	Мужской зал
3	Девочки до 7 лет
4	Мальчики до 7 лет
5	Маникюр
6	Лицо
\.


--
-- Name: service_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: katrin
--

SELECT pg_catalog.setval('service_type_id_seq', 9, true);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: gallery gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY gallery
    ADD CONSTRAINT gallery_pkey PRIMARY KEY (id);


--
-- Name: goods_types goods_types_pkey; Type: CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY goods_types
    ADD CONSTRAINT goods_types_pkey PRIMARY KEY (id);


--
-- Name: masters masters_pkey; Type: CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY masters
    ADD CONSTRAINT masters_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: service_list service_list_pkey; Type: CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY service_list
    ADD CONSTRAINT service_list_pkey PRIMARY KEY (id);


--
-- Name: service_type service_type_pkey; Type: CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY service_type
    ADD CONSTRAINT service_type_pkey PRIMARY KEY (id);


--
-- Name: goods_list fk_goods_list_goods_type; Type: FK CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY goods_list
    ADD CONSTRAINT fk_goods_list_goods_type FOREIGN KEY (type) REFERENCES goods_types(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: service_list fk_service_list_service_type; Type: FK CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY service_list
    ADD CONSTRAINT fk_service_list_service_type FOREIGN KEY (type) REFERENCES service_type(id);


--
-- Name: gallery master_id_fk1; Type: FK CONSTRAINT; Schema: public; Owner: katrin
--

ALTER TABLE ONLY gallery
    ADD CONSTRAINT master_id_fk1 FOREIGN KEY (masterid) REFERENCES masters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

