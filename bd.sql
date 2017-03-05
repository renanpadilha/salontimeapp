CREATE TABLE cliente (
  id SERIAL NOT NULL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  senha TEXT NOT NULL,
  telefone TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE estabelecimento (
  id SERIAL NOT NULL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  senha TEXT NOT NULL,
  endereco TEXT NOT NULL,
  telefone TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP);

CREATE TABLE profissional (
  id SERIAL NOT NULL PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  porcentagem INTEGER,
  id_estabelecimento SERIAL NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_profissional_estabelecimento
    FOREIGN KEY (id_estabelecimento)
    REFERENCES estabelecimento (id)
);

CREATE TABLE categoria (
  id SERIAL NOT NULL PRIMARY KEY,
  nome TEXT NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE servico (
  id SERIAL NOT NULL PRIMARY KEY,
  nome TEXT NOT NULL,
  duracao INTEGER NOT NULL,
  id_categoria SERIAL NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_servico_categoria
    FOREIGN KEY (id_categoria)
    REFERENCES categoria (id)
);

CREATE TABLE estabelecimento_servico (
  id SERIAL PRIMARY KEY NOT NULL,
  preco DECIMAL,
  id_estabelecimento SERIAL NOT NULL,
  id_servico SERIAL NOT NULL,
  CONSTRAINT fk_servico_estabelecimento
    FOREIGN KEY (id_estabelecimento)
    REFERENCES estabelecimento (id),
  CONSTRAINT fk_estabelecimento_servico
    FOREIGN KEY (id_servico)
    REFERENCES servico (id)
);

CREATE TABLE profissional_servico (
  id SERIAL PRIMARY KEY NOT NULL,
  id_profissional SERIAL NOT NULL,
  id_servico SERIAL NOT NULL,
  CONSTRAINT fk_profissional_servico
    FOREIGN KEY (id_servico)
    REFERENCES servico (id),
  CONSTRAINT fk_servico_profissional
    FOREIGN KEY (id_profissional)
    REFERENCES profissional (id)
);

CREATE TABLE agendamento (
  id SERIAL NOT NULL PRIMARY KEY,
  data TIMESTAMP NOT NULL,
  id_estabelecimento SERIAL NOT NULL,
  id_cliente SERIAL NOT NULL,
  id_profissional SERIAL NOT NULL,
  id_servico SERIAL NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_agendamento_estabelecimento
    FOREIGN KEY (id_estabelecimento)
    REFERENCES estabelecimento (id),
  CONSTRAINT fk_agendamento_cliente
    FOREIGN KEY (id_cliente)
    REFERENCES cliente (id),
  CONSTRAINT fk_agendamento_profissional
    FOREIGN KEY (id_profissional)
    REFERENCES profissional (id),
  CONSTRAINT fk_agendamento_servico
    FOREIGN KEY (id_servico)
    REFERENCES servico (id)
);
INSERT INTO usuarios (username, password, tipo, criado_em) VALUES ('c_1', '123123', 'C', CURRENT_TIMESTAMP);
INSERT INTO usuarios (username, password, tipo, criado_em) VALUES ('c_2', '123123', 'C', CURRENT_TIMESTAMP);
INSERT INTO usuarios (username, password, tipo, criado_em) VALUES ('e_1', '123123', 'E', CURRENT_TIMESTAMP);
INSERT INTO usuarios (username, password, tipo, criado_em) VALUES ('e_2', '123123', 'E', CURRENT_TIMESTAMP);

INSERT INTO clientes (nome, email, telefone, id_usuario, criado_em) VALUES ('Renan', 'renanpadilha94@hotmail.com', '5184941322', 1, CURRENT_TIMESTAMP);
INSERT INTO clientes (nome, email, telefone, id_usuario, criado_em) VALUES ('Déffany', 'deffanyo@gmail.com', '5199853364', 2, CURRENT_TIMESTAMP);

INSERT INTO estabelecimentos (nome, email, endereco, telefone, criado_em) VALUES ('Hugo Beauty', 'contato@hugobeauty.com.br', 'Avenida Ipiranga, 8433', '5184941322', 3, CURRENT_TIMESTAMP);
INSERT INTO estabelecimentos (nome, email, endereco, telefone, criado_em) VALUES ('Salão da Dona Ana', 'contato@salaodonaana.com.br', 'Rua José Alves de Castro, 522', '5133332222', 4, CURRENT_TIMESTAMP);

INSERT INTO categorias(nome) VALUES ('Barba');
INSERT INTO categorias(nome) VALUES ('Cabelo');
INSERT INTO categorias(nome) VALUES ('Depilação');
INSERT INTO categorias(nome) VALUES ('Estética Corporal');
INSERT INTO categorias(nome) VALUES ('Estética Facial');
INSERT INTO categorias(nome) VALUES ('Manicure e Pedicure');
INSERT INTO categorias(nome) VALUES ('Maquiagem');
INSERT INTO categorias(nome) VALUES ('Massagem');
INSERT INTO categorias(nome) VALUES ('Podologia');
INSERT INTO categorias(nome) VALUES ('Outros');

INSERT INTO servicos(nome, duracao ,id_categoria) VALUES ('Corte masculino', 30, 2);
INSERT INTO servicos(nome, duracao ,id_categoria) VALUES ('Depilação peito', 30, 3);
INSERT INTO servicos(nome, duracao ,id_categoria) VALUES ('Mão', 60, 6);

INSERT INTO profissionais (nome, email, telefone, porcentagem, id_estabelecimento, criado_em) VALUES ('Juliana', 'renanpadilha94@hotmail.com', '5184941322', 70, 1, CURRENT_TIMESTAMP);
INSERT INTO profissionais (nome, email, telefone, porcentagem, id_estabelecimento, criado_em) VALUES ('Craudete', 'deffanyo@gmail.com', '51984242312', 50, 2, CURRENT_TIMESTAMP);
INSERT INTO estabelecimentos_servicos (preco, id_estabelecimento, id_servico) VALUES (30, 1, 1);
INSERT INTO estabelecimentos_servicos (preco, id_estabelecimento, id_servico) VALUES (30, 2, 2);
INSERT INTO profissionais_servicos (id_profissional, id_servico) VALUES (1, 1);
INSERT INTO profissionais_servicos (id_profissional, id_servico) VALUES (1, 2);
INSERT INTO profissionais_servicos (id_profissional, id_servico) VALUES (2, 2);
