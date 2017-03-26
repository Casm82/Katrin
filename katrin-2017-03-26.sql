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
-- Name: feedbacks; Type: TABLE; Schema: public; Owner: casm
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


ALTER TABLE feedbacks OWNER TO casm;

--
-- Name: feedbacks_id_seq; Type: SEQUENCE; Schema: public; Owner: casm
--

CREATE SEQUENCE feedbacks_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE feedbacks_id_seq OWNER TO casm;

--
-- Name: feedbacks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: casm
--

ALTER SEQUENCE feedbacks_id_seq OWNED BY feedbacks.id;


--
-- Name: gallery; Type: TABLE; Schema: public; Owner: casm
--

CREATE TABLE gallery (
    id integer NOT NULL,
    masterid integer NOT NULL,
    filename character varying(50) NOT NULL,
    created timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE gallery OWNER TO casm;

--
-- Name: gallery_id_seq; Type: SEQUENCE; Schema: public; Owner: casm
--

CREATE SEQUENCE gallery_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE gallery_id_seq OWNER TO casm;

--
-- Name: gallery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: casm
--

ALTER SEQUENCE gallery_id_seq OWNED BY gallery.id;


--
-- Name: masters; Type: TABLE; Schema: public; Owner: casm
--

CREATE TABLE masters (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    title character varying(50) NOT NULL,
    email character varying(50) DEFAULT NULL::character varying,
    notify boolean DEFAULT false,
    tel character varying(50) DEFAULT NULL::character varying
);


ALTER TABLE masters OWNER TO casm;

--
-- Name: masters_id_seq; Type: SEQUENCE; Schema: public; Owner: casm
--

CREATE SEQUENCE masters_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE masters_id_seq OWNER TO casm;

--
-- Name: masters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: casm
--

ALTER SEQUENCE masters_id_seq OWNED BY masters.id;


--
-- Name: questions; Type: TABLE; Schema: public; Owner: casm
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


ALTER TABLE questions OWNER TO casm;

--
-- Name: questions_id_seq; Type: SEQUENCE; Schema: public; Owner: casm
--

CREATE SEQUENCE questions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE questions_id_seq OWNER TO casm;

--
-- Name: questions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: casm
--

ALTER SEQUENCE questions_id_seq OWNED BY questions.id;


--
-- Name: requests; Type: TABLE; Schema: public; Owner: casm
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


ALTER TABLE requests OWNER TO casm;

--
-- Name: requests_id_seq; Type: SEQUENCE; Schema: public; Owner: casm
--

CREATE SEQUENCE requests_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE requests_id_seq OWNER TO casm;

--
-- Name: requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: casm
--

ALTER SEQUENCE requests_id_seq OWNED BY requests.id;


--
-- Name: service_list; Type: TABLE; Schema: public; Owner: casm
--

CREATE TABLE service_list (
    id integer NOT NULL,
    type integer NOT NULL,
    name character varying(50) NOT NULL,
    description character varying(1000) NOT NULL,
    duration integer NOT NULL,
    price integer NOT NULL
);


ALTER TABLE service_list OWNER TO casm;

--
-- Name: service_list_id_seq; Type: SEQUENCE; Schema: public; Owner: casm
--

CREATE SEQUENCE service_list_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE service_list_id_seq OWNER TO casm;

--
-- Name: service_list_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: casm
--

ALTER SEQUENCE service_list_id_seq OWNED BY service_list.id;


--
-- Name: service_type; Type: TABLE; Schema: public; Owner: casm
--

CREATE TABLE service_type (
    id integer NOT NULL,
    name character varying(50) NOT NULL
);


ALTER TABLE service_type OWNER TO casm;

--
-- Name: service_type_id_seq; Type: SEQUENCE; Schema: public; Owner: casm
--

CREATE SEQUENCE service_type_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE service_type_id_seq OWNER TO casm;

--
-- Name: service_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: casm
--

ALTER SEQUENCE service_type_id_seq OWNED BY service_type.id;


--
-- Name: feedbacks id; Type: DEFAULT; Schema: public; Owner: casm
--

ALTER TABLE ONLY feedbacks ALTER COLUMN id SET DEFAULT nextval('feedbacks_id_seq'::regclass);


--
-- Name: gallery id; Type: DEFAULT; Schema: public; Owner: casm
--

ALTER TABLE ONLY gallery ALTER COLUMN id SET DEFAULT nextval('gallery_id_seq'::regclass);


--
-- Name: masters id; Type: DEFAULT; Schema: public; Owner: casm
--

ALTER TABLE ONLY masters ALTER COLUMN id SET DEFAULT nextval('masters_id_seq'::regclass);


--
-- Name: questions id; Type: DEFAULT; Schema: public; Owner: casm
--

ALTER TABLE ONLY questions ALTER COLUMN id SET DEFAULT nextval('questions_id_seq'::regclass);


--
-- Name: requests id; Type: DEFAULT; Schema: public; Owner: casm
--

ALTER TABLE ONLY requests ALTER COLUMN id SET DEFAULT nextval('requests_id_seq'::regclass);


--
-- Name: service_list id; Type: DEFAULT; Schema: public; Owner: casm
--

ALTER TABLE ONLY service_list ALTER COLUMN id SET DEFAULT nextval('service_list_id_seq'::regclass);


--
-- Name: service_type id; Type: DEFAULT; Schema: public; Owner: casm
--

ALTER TABLE ONLY service_type ALTER COLUMN id SET DEFAULT nextval('service_type_id_seq'::regclass);


--
-- Data for Name: feedbacks; Type: TABLE DATA; Schema: public; Owner: casm
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
-- Name: feedbacks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: casm
--

SELECT pg_catalog.setval('feedbacks_id_seq', 11, true);


--
-- Data for Name: gallery; Type: TABLE DATA; Schema: public; Owner: casm
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
-- Name: gallery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: casm
--

SELECT pg_catalog.setval('gallery_id_seq', 29, true);


--
-- Data for Name: masters; Type: TABLE DATA; Schema: public; Owner: casm
--

COPY masters (id, name, title, email, notify, tel) FROM stdin;
8	Ольга Кузнецова	мастер ногтевого сервиса	olga@katrin.ru	f	541111
9	Наталья Кодесникова	мастер ногтевого сервиса	nata@katrin.ru	f	541112
10	Александра Степанова	парикмахер	alexa@katrin.ru	f	541113
11	Ольга Якурнова	парикмахер	olya@katrin.ru	f	
12	Мария Александрова	мастер по наращиванию волос	maria@katrin.ru	t	
13	Александр Кашурников	тату мастер	alex@katrin.ru	t	
14	Анна Мариасис	менеджер	anna@katrin.ru	t	541110
\.


--
-- Name: masters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: casm
--

SELECT pg_catalog.setval('masters_id_seq', 15, true);


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: casm
--

COPY questions (id, ts, name, email, tel, message, answered) FROM stdin;
2	2017-03-21 06:52:50	Катя	kat@mail.ru	\N	Парики есть?	t
1	2017-03-26 22:12:19.704577	asd	asd	asd	ad	t
\.


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: casm
--

SELECT pg_catalog.setval('questions_id_seq', 3, true);


--
-- Data for Name: requests; Type: TABLE DATA; Schema: public; Owner: casm
--

COPY requests (id, name, email, tel, message, serviceid, selecteddate, regdate, completed) FROM stdin;
35	sdfsdf	\N	3333	\N	7	2017-03-25 10:00:00	2017-03-24 10:07:58	f
13	Ddd	\N	1212	\N	13	2017-03-24 09:00:00	2017-03-24 05:40:06	t
\.


--
-- Name: requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: casm
--

SELECT pg_catalog.setval('requests_id_seq', 36, true);


--
-- Data for Name: service_list; Type: TABLE DATA; Schema: public; Owner: casm
--

COPY service_list (id, type, name, description, duration, price) FROM stdin;
1	1	Чистка лица	Процедуры по очищению кожи лица с помощью мануальных или аппаратных методик, способствующих удалению загрязнений, отшелушиванию отмершего эпидермиса, устранению комедонов и воспалительных элементов	90	350
2	1	Косметические маски	Средство дополнительного ухода за кожей лица, предполагающее нанесение на нее определенного состава веществ	120	330
3	1	Массаж лица	Процедура, включающая стимулирующее или расслабляющее воздействие на кожу, подкожные слои, сосуды и нервно-мышечные волокна с целью достижения необходимого косметического эффекта	60	330
4	1	Косметологический уход	Это серия косметологических процедур, которые проводятся поэтапно	120	500
5	2	Обесцвечивание	Обесцвечивание волос представляет собой процесс, при котором происходит полное или частичное разрушение окрашивающего или натурального пигмента.	60	400
6	2	Колорирование	Колорирование на темные волосы: какие оттенки выбрать, фото, все тонкости процедуры Само слово «колорирование» происходит от английского «color» — цвет. В этом и заключается вся суть процедуры: несколько близких друг другу оттенков, нанесенных на локоны, насыщают их цветом и добавляют блеск.	60	400
7	2	Прическа свадебная	Свадьба — это знаменательное событие, на котором каждая девушка хочет выглядеть как сказочная принцесса.	90	1000
8	2	Прическа вечерняя	Вечерняя прическа – особенная, потому что она предназначена не для повседневности, а для особых случаев. Она украшает женщину, добавляет ей очарование, изящество и грацию, а также немного таинственности и загадочности.	90	600
9	2	Стрижка модельная	Это не просто аккуратно подстриженные волосы, а проработанное до мелочей силуэтное решение, строго выверенный фасон и характерные черты.	40	200
10	2	Окантовка	Это операция стрижки, в результате которой образуется четкая линия, ограничивающая волосы по направлению их естественного роста, и создается контур будущей прически	20	200
11	2	Мытье головы	Мытье головы в парикмахерских - одна из основных операций, применяемая почти при всех видах обработки волос. Роль этой операции в настоящее время все возрастает. Так, в последние годы вместе с применением филировочной бритвы был освоен новый метод обработки волос - стрижка, которая требует обязательного мытья головы. То же можно сказать и о моделировании причесок с применением химических составов.	10	50
12	3	Маникюр комбинированный		60	1000
13	3	Маникюр мужской		60	1000
14	3	Маникюр детский		60	800
15	3	Покрытие лаком		30	500
16	3	Лечебное покрытие		20	300
17	3	Уход за руками (маска + массаж)		60	1000
18	4	Татуировка на руке		120	2000
19	4	Татуировка на спине		180	3000
26	4	Рисунок хной		30	200
\.


--
-- Name: service_list_id_seq; Type: SEQUENCE SET; Schema: public; Owner: casm
--

SELECT pg_catalog.setval('service_list_id_seq', 29, true);


--
-- Data for Name: service_type; Type: TABLE DATA; Schema: public; Owner: casm
--

COPY service_type (id, name) FROM stdin;
1	Уход за лицом
2	Парикмахерские услуги
3	Уход за ногтями
4	Татуировки
\.


--
-- Name: service_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: casm
--

SELECT pg_catalog.setval('service_type_id_seq', 5, true);


--
-- Name: feedbacks feedbacks_pkey; Type: CONSTRAINT; Schema: public; Owner: casm
--

ALTER TABLE ONLY feedbacks
    ADD CONSTRAINT feedbacks_pkey PRIMARY KEY (id);


--
-- Name: gallery gallery_pkey; Type: CONSTRAINT; Schema: public; Owner: casm
--

ALTER TABLE ONLY gallery
    ADD CONSTRAINT gallery_pkey PRIMARY KEY (id);


--
-- Name: masters masters_pkey; Type: CONSTRAINT; Schema: public; Owner: casm
--

ALTER TABLE ONLY masters
    ADD CONSTRAINT masters_pkey PRIMARY KEY (id);


--
-- Name: questions questions_pkey; Type: CONSTRAINT; Schema: public; Owner: casm
--

ALTER TABLE ONLY questions
    ADD CONSTRAINT questions_pkey PRIMARY KEY (id);


--
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: casm
--

ALTER TABLE ONLY requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (id);


--
-- Name: service_list service_list_pkey; Type: CONSTRAINT; Schema: public; Owner: casm
--

ALTER TABLE ONLY service_list
    ADD CONSTRAINT service_list_pkey PRIMARY KEY (id);


--
-- Name: service_type service_type_pkey; Type: CONSTRAINT; Schema: public; Owner: casm
--

ALTER TABLE ONLY service_type
    ADD CONSTRAINT service_type_pkey PRIMARY KEY (id);


--
-- Name: service_list fk_service_list_service_type; Type: FK CONSTRAINT; Schema: public; Owner: casm
--

ALTER TABLE ONLY service_list
    ADD CONSTRAINT fk_service_list_service_type FOREIGN KEY (type) REFERENCES service_type(id);


--
-- Name: gallery master_id_fk1; Type: FK CONSTRAINT; Schema: public; Owner: casm
--

ALTER TABLE ONLY gallery
    ADD CONSTRAINT master_id_fk1 FOREIGN KEY (masterid) REFERENCES masters(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

