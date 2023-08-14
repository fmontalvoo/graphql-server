import axios from 'axios';
import { v1 as uuid } from 'uuid';
import { ApolloServer, gql, UserInputError } from 'apollo-server';

const persons = [
    {
        id: '50a33210-3ab8-11ee-9307-91eb88ef2f70',
        name: 'John',
        city: 'Anytown',
        phone: '1234567890',
        street: '1234 Main St',
    },
    {
        id: '59f843a0-3ab8-11ee-806d-f7e3f99b196b',
        name: 'Mary',
        city: 'Othertown',
        phone: '0987654321',
        street: '4321 Main St',
    },
    {
        id: '59f843a0-3ab8-11ee-806d-f7e3f99b196b',
        name: 'Joe',
        city: 'Anytown',
        street: '2468 Main St',
    },
];

const typeDefs = gql`
    enum YesNo {
        YES
        NO
    }

    type Query {
        findAll(phone: YesNo): [Person]!
        findById(id: ID!): Person
    }

    type Mutation {
        addPerson(name: String!, phone: String, city: String!, street: String!): Person
        updateNumber(id: ID!, phone: String!): Person
    }
    
    type Person {
        id: ID!
        name: String!
        phone: String
        address: Address!
    }

    type Address {
        city: String!
        street: String!
    }
`;

const resolvers = {
    Query: {
        findAll: async (parent, args) => {
            const { data: personsResponse } = await axios.get('http://localhost:3001/persons');

            if (!args.phone) return personsResponse;
            return personsResponse.filter(person => args.phone === 'YES' ? person.phone : !person.phone)
        },
        findById: (parent, args) => persons.find(person => person.id === Number(args.id)),
    },
    Mutation: {
        addPerson: (parent, args) => {
            if (persons.find(person => person.name === args.name)) {
                throw new UserInputError('Name must be unique', {
                    invalidArgs: args.name,
                });
            }
            const person = {
                id: uuid(),
                ...args
            };
            persons.push(person);
            return person;
        },
        updateNumber: (parent, args) => {
            const index = persons.findIndex(person => person.id === args.id);
            if (index === -1) return null;
            const updatedPerson = { ...persons[index], phone: args.phone };
            persons[index] = updatedPerson;
            return updatedPerson;
        }
    },
    Person: {
        address: parent => ({
            city: parent.city,
            street: parent.street,
        }),
    }
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
    console.info(`🚀  Server ready at ${url}`);
});