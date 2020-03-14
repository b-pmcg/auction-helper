import { Heading, Text, jsx, Box, Button, Styled, Input, Flex } from 'theme-ui';

export default ({ children }) => {
  return (
    <Flex
      sx={{
        justifyContent: 'center'
      }}
    >
      <Box
        sx={{
          width: '1140px'
        }}
      >
        {children}
      </Box>
    </Flex>
  );
};
