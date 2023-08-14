import { ApolloServer, gql } from 'apollo-server';

const persons = [
    {
        id: 1,
        name: 'John',
        city: 'Anytown',
        phone: '1234567890',
        street: '1234 Main St',
    },
    {
        id: 2,
        name: 'Mary',
        city: 'Othertown',
        phone: '0987654321',
        street: '4321 Main St',
    },
    {
        id: 3,
        name: 'Joe',
        city: 'Anytown',
        street: '2468 Main St',
    },
];

const typeDefs = gql`
    type Query {
        findAll: [Person]!
        findById(id:ID!): Person
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
        findAll: () => persons,
        findById: (parent, args) => persons.find(person => person.id === Number(args.id)),
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