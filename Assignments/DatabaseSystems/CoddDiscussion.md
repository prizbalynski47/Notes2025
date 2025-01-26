# 1) Relational Model and Normal Form

### Relational models appear superior to graph or network models
- Describes data using its natrual structure
- User programs and machine representation/orginization are independant

### Data at the time had three dependencies that needed removed
- Ordering dependence
- Indexing dependence
- Access path dependence

Problems of ordering dependence
- Programs that utilize stored ordering fail if ordering needs to change
- It's hard to distinguish between presentation ordering and stored ordering

Problems of indexing dependence
- Slows down insertions and deletions
- Programs don't operate correctly if chains of indices are removed

Problems of access path dependence
- Systems tend to get logically impaired if trees or networks are changed
- System has to be designed to test for proper tree structuring to support multiple structures, which isn't a practical solution.

### Relational Views of Data

Identical domains
- Allows support for two or more identical domain names
- The user doesn't have to remember ordering of domain names because they will deal with relationships, not the relations themselves
- This means domains have to be uniquely identifiable within their relation, but not necessarily outside of it

Simplicity
- A user doesn't have to know anything about a relationship other than its name and the names of its domains
- Domains/combos of domains are the primary key

### Normal Form

If all domains are simple they can be represented as a 2d array


