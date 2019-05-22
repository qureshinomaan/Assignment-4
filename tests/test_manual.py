import app
import unittest


class MyTestCase(unittest.TestCase):

    def setUp(self):
        app.app.testing = True
        self.app = app.app.test_client()

    def test_intro(self):
        result = self.app.get('/manual')
        # Make your assertions
        self.assertEqual(result.status_code,200)

if __name__=='__main__':
    unittest.main()
