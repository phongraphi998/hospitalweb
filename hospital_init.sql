--
-- PostgreSQL database dump
--

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-03-10 18:18:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 872 (class 1247 OID 24984)
-- Name: appointment_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.appointment_status AS ENUM (
    'PENDING',
    'CHECKED_IN',
    'COMPLETED',
    'CANCELLED'
);


ALTER TYPE public.appointment_status OWNER TO postgres;

--
-- TOC entry 875 (class 1247 OID 24994)
-- Name: billing_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.billing_status AS ENUM (
    'UNPAID',
    'PAID'
);


ALTER TYPE public.billing_status OWNER TO postgres;

--
-- TOC entry 869 (class 1247 OID 24977)
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'ADMIN',
    'DOCTOR',
    'NURSE'
);


ALTER TYPE public.user_role OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 228 (class 1259 OID 25067)
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id integer NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    department_id integer,
    start_time timestamp without time zone NOT NULL,
    reason text,
    status public.appointment_status DEFAULT 'PENDING'::public.appointment_status,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 25066)
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO postgres;

--
-- TOC entry 5138 (class 0 OID 0)
-- Dependencies: 227
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- TOC entry 236 (class 1259 OID 25151)
-- Name: billing; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.billing (
    id integer NOT NULL,
    appointment_id integer,
    total_amount numeric(10,2) DEFAULT 0,
    status public.billing_status DEFAULT 'UNPAID'::public.billing_status,
    issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    paid_at timestamp without time zone
);


ALTER TABLE public.billing OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 25150)
-- Name: billing_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.billing_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.billing_id_seq OWNER TO postgres;

--
-- TOC entry 5139 (class 0 OID 0)
-- Dependencies: 235
-- Name: billing_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.billing_id_seq OWNED BY public.billing.id;


--
-- TOC entry 222 (class 1259 OID 25017)
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    head character varying(150) DEFAULT '',
    phone character varying(20) DEFAULT '',
    floor character varying(20) DEFAULT '',
    status character varying(20) DEFAULT 'Active',
    description text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 25016)
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- TOC entry 5140 (class 0 OID 0)
-- Dependencies: 221
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- TOC entry 230 (class 1259 OID 25098)
-- Name: medical_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_records (
    id integer NOT NULL,
    appointment_id integer,
    diagnosis text,
    treatment text,
    notes text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.medical_records OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 25097)
-- Name: medical_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_records_id_seq OWNER TO postgres;

--
-- TOC entry 5141 (class 0 OID 0)
-- Dependencies: 229
-- Name: medical_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_records_id_seq OWNED BY public.medical_records.id;


--
-- TOC entry 226 (class 1259 OID 25053)
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    gender character varying(20),
    birth_date date,
    phone character varying(20),
    address text,
    blood_group character varying(5),
    emergency_contact character varying(20),
    status character varying(20) DEFAULT 'Active',
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 25052)
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO postgres;

--
-- TOC entry 5142 (class 0 OID 0)
-- Dependencies: 225
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- TOC entry 234 (class 1259 OID 25132)
-- Name: prescription_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescription_items (
    id integer NOT NULL,
    prescription_id integer NOT NULL,
    medicine_name character varying(255) NOT NULL,
    dosage character varying(100) NOT NULL,
    frequency character varying(100) NOT NULL,
    duration_days integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.prescription_items OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 25131)
-- Name: prescription_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescription_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescription_items_id_seq OWNER TO postgres;

--
-- TOC entry 5143 (class 0 OID 0)
-- Dependencies: 233
-- Name: prescription_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescription_items_id_seq OWNED BY public.prescription_items.id;


--
-- TOC entry 232 (class 1259 OID 25116)
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id integer NOT NULL,
    appointment_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 25115)
-- Name: prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescriptions_id_seq OWNER TO postgres;

--
-- TOC entry 5144 (class 0 OID 0)
-- Dependencies: 231
-- Name: prescriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescriptions_id_seq OWNED BY public.prescriptions.id;


--
-- TOC entry 224 (class 1259 OID 25029)
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    id integer NOT NULL,
    user_id integer,
    first_name character varying(100) NOT NULL,
    last_name character varying(100) NOT NULL,
    department_id integer,
    specialization character varying(150),
    phone character varying(20),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 25028)
-- Name: staff_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.staff_id_seq OWNER TO postgres;

--
-- TOC entry 5145 (class 0 OID 0)
-- Dependencies: 223
-- Name: staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.staff_id_seq OWNED BY public.staff.id;


--
-- TOC entry 220 (class 1259 OID 25000)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    password_hash text NOT NULL,
    role public.user_role NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 24999)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 5146 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4913 (class 2604 OID 25070)
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- TOC entry 4922 (class 2604 OID 25154)
-- Name: billing id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing ALTER COLUMN id SET DEFAULT nextval('public.billing_id_seq'::regclass);


--
-- TOC entry 4907 (class 2604 OID 25020)
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- TOC entry 4916 (class 2604 OID 25101)
-- Name: medical_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records ALTER COLUMN id SET DEFAULT nextval('public.medical_records_id_seq'::regclass);


--
-- TOC entry 4911 (class 2604 OID 25056)
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- TOC entry 4920 (class 2604 OID 25135)
-- Name: prescription_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_items ALTER COLUMN id SET DEFAULT nextval('public.prescription_items_id_seq'::regclass);


--
-- TOC entry 4918 (class 2604 OID 25119)
-- Name: prescriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions ALTER COLUMN id SET DEFAULT nextval('public.prescriptions_id_seq'::regclass);


--
-- TOC entry 4909 (class 2604 OID 25032)
-- Name: staff id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff ALTER COLUMN id SET DEFAULT nextval('public.staff_id_seq'::regclass);


--
-- TOC entry 4905 (class 2604 OID 25003)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 5124 (class 0 OID 25067)
-- Dependencies: 228
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, patient_id, doctor_id, department_id, start_time, reason, status, created_at) FROM stdin;
1	1	1	1	2026-03-06 01:51:06.952624	Chest pain consultation	PENDING	2026-03-05 01:51:06.952624
\.


--
-- TOC entry 5132 (class 0 OID 25151)
-- Dependencies: 236
-- Data for Name: billing; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.billing (id, appointment_id, total_amount, status, issued_at, paid_at) FROM stdin;
1	1	1500.00	UNPAID	2026-03-05 01:51:06.952624	\N
\.


--
-- TOC entry 5118 (class 0 OID 25017)
-- Dependencies: 222
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, code, name, head, phone, floor, status, description, created_at, updated_at) FROM stdin;
1	C	Cardiology	Dr. Somchai Jaidee	02-111-0001	3	Active	Heart and cardiovascular treatments	2026-03-05 01:51:06.952624	2026-03-05 01:51:06.952624
2	GM	General Medicine	Dr. Suda Dee	02-111-0002	1	Active	General health and diagnosis	2026-03-05 01:51:06.952624	2026-03-05 01:51:06.952624
\.


--
-- TOC entry 5126 (class 0 OID 25098)
-- Dependencies: 230
-- Data for Name: medical_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_records (id, appointment_id, diagnosis, treatment, notes, created_at) FROM stdin;
1	1	Mild heart inflammation	Prescribed medication and rest	Follow-up in 2 weeks	2026-03-05 01:51:06.952624
\.


--
-- TOC entry 5122 (class 0 OID 25053)
-- Dependencies: 226
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, first_name, last_name, gender, birth_date, phone, address, created_at) FROM stdin;
1	Anan	Wongchai	Male	1995-05-10	0901112222	Bangkok, Thailand	2026-03-05 01:51:06.952624
2	Kanya	Srisuk	Female	2000-08-20	0903334444	Chiang Mai, Thailand	2026-03-05 01:51:06.952624
\.


--
-- TOC entry 5130 (class 0 OID 25132)
-- Dependencies: 234
-- Data for Name: prescription_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescription_items (id, prescription_id, medicine_name, dosage, frequency, duration_days, created_at) FROM stdin;
1	1	Aspirin	100mg	Once daily	14	2026-03-05 01:51:06.952624
2	1	Beta Blocker	50mg	Twice daily	14	2026-03-05 01:51:06.952624
\.


--
-- TOC entry 5128 (class 0 OID 25116)
-- Dependencies: 232
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, appointment_id, created_at) FROM stdin;
1	1	2026-03-05 01:51:06.952624
\.


--
-- TOC entry 5120 (class 0 OID 25029)
-- Dependencies: 224
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.staff (id, user_id, first_name, last_name, department_id, specialization, phone, created_at) FROM stdin;
1	2	Somchai	Jaidee	1	Cardiologist	0812345678	2026-03-05 01:51:06.952624
2	3	Suda	Dee	2	Registered Nurse	0898765432	2026-03-05 01:51:06.952624
\.


--
-- TOC entry 5116 (class 0 OID 25000)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, password_hash, role, created_at) FROM stdin;
4	test@hospital.com	$2b$10$t6qU1o9yXwcSjmWb4u0RVu2iX0TVbGMzQjMYU14nCI57prEL41NY6	DOCTOR	2026-03-05 02:03:10.408284
5	test_doctor@hospital.com	$2b$10$C12WIMOvbHxf1D9e1TUFVO6ooRdk1Yr2.1nB0KNtgQ9XZchDf8SEa	DOCTOR	2026-03-05 02:25:20.033525
6	testnurse@hospital.com	$2b$10$VqEeTfcEvTbhcK.gZ6b7Jea3xvOCYUd1EnqXvYzYUK39EDJAXW8mS	NURSE	2026-03-05 02:25:34.393231
1	admin@hospital.com	$2b$10$rJZmpk3B07QS7VKo.lMJ1ezpqxKCokvy47Cvp9WhAVTxLEBvFggpC	ADMIN	2026-03-05 01:51:06.952624
2	doctor@hospital.com	$2b$10$dbL1N8WDafNAaXZ2OAFN8eIoOi4D.FjBzFySAMzRDqsU4As86wzmq	DOCTOR	2026-03-05 01:51:06.952624
3	nurse@hospital.com	$2b$10$msU4i.T4cF3PHi18DRRM0.8jPEPKApMgmCyiM2E1AsSVkG1c.7DBW	NURSE	2026-03-05 01:51:06.952624
\.


--
-- TOC entry 5147 (class 0 OID 0)
-- Dependencies: 227
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 1, true);


--
-- TOC entry 5148 (class 0 OID 0)
-- Dependencies: 235
-- Name: billing_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.billing_id_seq', 1, true);


--
-- TOC entry 5149 (class 0 OID 0)
-- Dependencies: 221
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 2, true);


--
-- TOC entry 5150 (class 0 OID 0)
-- Dependencies: 229
-- Name: medical_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_records_id_seq', 1, true);


--
-- TOC entry 5151 (class 0 OID 0)
-- Dependencies: 225
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 2, true);


--
-- TOC entry 5152 (class 0 OID 0)
-- Dependencies: 233
-- Name: prescription_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescription_items_id_seq', 2, true);


--
-- TOC entry 5153 (class 0 OID 0)
-- Dependencies: 231
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 1, true);


--
-- TOC entry 5154 (class 0 OID 0)
-- Dependencies: 223
-- Name: staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.staff_id_seq', 2, true);


--
-- TOC entry 5155 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 6, true);


--
-- TOC entry 4942 (class 2606 OID 25080)
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- TOC entry 4955 (class 2606 OID 25162)
-- Name: billing billing_appointment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing
    ADD CONSTRAINT billing_appointment_id_key UNIQUE (appointment_id);


--
-- TOC entry 4957 (class 2606 OID 25160)
-- Name: billing billing_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing
    ADD CONSTRAINT billing_pkey PRIMARY KEY (id);


--
-- TOC entry 4932 (class 2606 OID 25027)
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- TOC entry 4945 (class 2606 OID 25109)
-- Name: medical_records medical_records_appointment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_appointment_id_key UNIQUE (appointment_id);


--
-- TOC entry 4947 (class 2606 OID 25107)
-- Name: medical_records medical_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_pkey PRIMARY KEY (id);


--
-- TOC entry 4940 (class 2606 OID 25064)
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- TOC entry 4953 (class 2606 OID 25144)
-- Name: prescription_items prescription_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_items
    ADD CONSTRAINT prescription_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4949 (class 2606 OID 25125)
-- Name: prescriptions prescriptions_appointment_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_appointment_id_key UNIQUE (appointment_id);


--
-- TOC entry 4951 (class 2606 OID 25123)
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- TOC entry 4935 (class 2606 OID 25038)
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- TOC entry 4937 (class 2606 OID 25040)
-- Name: staff staff_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_user_id_key UNIQUE (user_id);


--
-- TOC entry 4928 (class 2606 OID 25014)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 4930 (class 2606 OID 25012)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4943 (class 1259 OID 25096)
-- Name: idx_appointments_doctor_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appointments_doctor_time ON public.appointments USING btree (doctor_id, start_time);


--
-- TOC entry 4958 (class 1259 OID 25168)
-- Name: idx_billing_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_billing_status ON public.billing USING btree (status);


--
-- TOC entry 4938 (class 1259 OID 25065)
-- Name: idx_patients_last_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_patients_last_name ON public.patients USING btree (last_name);


--
-- TOC entry 4933 (class 1259 OID 25051)
-- Name: idx_staff_department; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_staff_department ON public.staff USING btree (department_id);


--
-- TOC entry 4926 (class 1259 OID 25015)
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- TOC entry 4961 (class 2606 OID 25091)
-- Name: appointments appointments_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 4962 (class 2606 OID 25086)
-- Name: appointments appointments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.staff(id) ON DELETE CASCADE;


--
-- TOC entry 4963 (class 2606 OID 25081)
-- Name: appointments appointments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patients(id) ON DELETE CASCADE;


--
-- TOC entry 4967 (class 2606 OID 25163)
-- Name: billing billing_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.billing
    ADD CONSTRAINT billing_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;


--
-- TOC entry 4964 (class 2606 OID 25110)
-- Name: medical_records medical_records_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;


--
-- TOC entry 4966 (class 2606 OID 25145)
-- Name: prescription_items prescription_items_prescription_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescription_items
    ADD CONSTRAINT prescription_items_prescription_id_fkey FOREIGN KEY (prescription_id) REFERENCES public.prescriptions(id) ON DELETE CASCADE;


--
-- TOC entry 4965 (class 2606 OID 25126)
-- Name: prescriptions prescriptions_appointment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_appointment_id_fkey FOREIGN KEY (appointment_id) REFERENCES public.appointments(id) ON DELETE CASCADE;


--
-- TOC entry 4959 (class 2606 OID 25046)
-- Name: staff staff_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- TOC entry 4960 (class 2606 OID 25041)
-- Name: staff staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


-- Completed on 2026-03-10 18:18:54

--
-- PostgreSQL database dump complete
--

\unrestrict OXs9fCfqdFPurZsY8vfUtgq6qEprKsJiqOMaVih8HkMcIlXVepDtOA7c8OTXm2q

