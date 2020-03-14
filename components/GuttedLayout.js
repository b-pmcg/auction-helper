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
          px: 5,
          width: '1140px'
        }}
      >
        {children}
      </Box>
    </Flex>
  );
};
